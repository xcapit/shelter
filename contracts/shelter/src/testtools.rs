#![cfg(test)]
extern crate std;

use ed25519_dalek::Signer;
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;
use soroban_sdk::testutils::BytesN as _;
use soroban_sdk::vec;
use soroban_sdk::xdr::AccountId;
use soroban_sdk::xdr::PublicKey;
use soroban_sdk::xdr::ScAddress;
use soroban_sdk::TryFromVal;
use soroban_sdk::{
    auth::{Context, ContractContext},
    testutils::{storage::Instance, Address as _, AuthorizedFunction, AuthorizedInvocation},
    token::{StellarAssetClient, TokenClient},
    Address, BytesN, Env, IntoVal, Symbol, Val, Vec,
};

use crate::pass::Pass;
use crate::storage_types::Error;
use crate::{shelter::Shelter, storage_types::INSTANCE_BUMP_AMOUNT, ShelterClient};

pub fn assert_instance_ttl_extension(env: &Env, shelter_address: &Address) {
    env.as_contract(shelter_address, || {
        assert_eq!(env.storage().instance().get_ttl(), INSTANCE_BUMP_AMOUNT);
    });
}

pub fn assert_assigned_aid(shelter: &ShelterClient, token: &TestToken) {
    assert_eq!(
        token.balance(&shelter.address),
        shelter.assigned_aid_of(&token.address())
    );
}

pub fn assert_auth_fn(env: &Env, address: Address, contract_info: (Address, Symbol, Vec<Val>)) {
    assert_eq!(
        env.auths(),
        std::vec![(
            address,
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract(contract_info),
                sub_invocations: std::vec![]
            }
        )]
    );
}

pub fn env_with_mock_auths() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

pub fn shelter_id(env: &Env, steward: &Address) -> Address {
    env.register(Shelter, (steward,))
}

pub struct RandomKeypair {
    env: Env,
    signing_key: SigningKey,
}
impl RandomKeypair {
    pub fn new(env: Env) -> Self {
        RandomKeypair {
            env,
            signing_key: SigningKey::generate(&mut OsRng),
        }
    }

    pub fn public_key(&self) -> BytesN<32> {
        self.signing_key
            .verifying_key()
            .to_bytes()
            .into_val(&self.env)
    }

    pub fn signing_key(&self) -> SigningKey {
        self.signing_key.clone()
    }

    pub fn shelter_pass(&self, payload: &BytesN<32>) -> Val {
        Pass {
            public_key: self.public_key(),
            signature: self
                .signing_key
                .sign(payload.to_array().as_slice())
                .to_bytes()
                .into_val(&self.env),
        }
        .into_val(&self.env)
    }

    pub fn signature_of(&self, payload: &BytesN<32>) -> BytesN<64> {
        self.signing_key
            .sign(payload.to_array().as_slice())
            .to_bytes()
            .into_val(&self.env)
    }
}

pub struct RandomAddresses {
    env: Env,
}
impl RandomAddresses {
    pub fn new(env: Env) -> Self {
        RandomAddresses { env }
    }

    pub fn generate<const N: usize>(&self) -> [Address; N] {
        self._generate(N).try_into().unwrap()
    }

    pub fn _generate(&self, quantity: usize) -> std::vec::Vec<Address> {
        (0..quantity)
            .map(|_| Address::generate(&self.env))
            .collect()
    }
}

pub struct TestToken<'a> {
    token: TokenClient<'a>,
    token_sac: StellarAssetClient<'a>,
}

impl TestToken<'_> {
    pub fn new(env: &Env) -> Self {
        let stellar_asset = env.register_stellar_asset_contract_v2(
            RandomAddresses::new(env.clone()).generate::<1>()[0].clone(),
        );

        TestToken {
            token: TokenClient::new(env, &stellar_asset.address()),
            token_sac: StellarAssetClient::new(env, &stellar_asset.address()),
        }
    }
    pub fn mint(&self, to: &Address, amount: &i128) {
        self.token_sac.mint(to, amount);
    }

    pub fn balance(&self, id: &Address) -> i128 {
        self.token.balance(id)
    }

    pub fn address(&self) -> Address {
        self.token_sac.address.clone()
    }
}

pub fn address_from_signing_key(env: &Env, signing_key: &SigningKey) -> Address {
    let public_key_bytes = signing_key.verifying_key().to_bytes(); // [u8; 32]
    let account_id = AccountId(PublicKey::PublicKeyTypeEd25519(public_key_bytes.into()));
    let sc_address = ScAddress::Account(account_id);
    Address::try_from_val(env, &sc_address).unwrap()
}
pub struct TestBucket<'a> {
    pub amount: i128,
    pub token: TestToken<'a>,
    pub shelter: ShelterClient<'a>,
    pub recipient: RandomKeypair,
    pub payload: BytesN<32>,
    pub steward_key: BytesN<32>,
    pub steward_signing_key: SigningKey,
    pub steward: Address,
    pub expiration: u64,
}

impl TestBucket<'_> {
    pub fn new(env: Env, amount: i128) -> Self {
        let steward = RandomKeypair::new(env.clone());
        let steward_address = address_from_signing_key(&env, &steward.signing_key());
        Self {
            amount,
            token: TestToken::new(&env),
            shelter: ShelterClient::new(&env, &shelter_id(&env, &steward_address)),
            recipient: RandomKeypair::new(env.clone()),
            payload: BytesN::random(&env),
            steward: steward_address,
            steward_key: steward.public_key(),
            steward_signing_key: steward.signing_key(),
            expiration: 100,
        }
    }

    pub fn default(env: Env) -> Self {
        Self::new(env, 100)
    }

    pub fn try_check_auth(
        &self,
        amount: i128,
        env: &Env,
    ) -> Result<(), Result<Error, soroban_sdk::InvokeError>> {
        env.try_invoke_contract_check_auth::<Error>(
            &self.shelter.address,
            &self.payload,
            self.recipient.shelter_pass(&self.payload),
            &vec![
                env,
                Context::Contract(ContractContext {
                    contract: self.token.address().clone(),
                    fn_name: Symbol::new(env, "transfer"),
                    args: (&self.shelter.address, Address::generate(env), amount).into_val(env),
                }),
            ],
        )
    }
}

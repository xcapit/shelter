#![cfg(test)]
extern crate std;
use ed25519_dalek::Signer;
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;
use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, BytesN, Env, IntoVal, Symbol, Val, Vec,
};

use crate::mini_shelter::MiniShelterClient;
use crate::pass::Pass;

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

pub fn env_with_mock_auths() -> Env {
    let env = Env::default();
    env.mock_all_auths();
    env
}

pub fn mini_shelter_id(
    env: &Env,
    steward: &Address,
    recipient: BytesN<32>,
    expiration_date: u64,
) -> Address {
    env.register(MiniShelter, (steward, recipient, expiration_date))
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

#[test]
fn test_steward_set_on_shelter_deployment() {
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient = RandomKeypair::new(env.clone());
    let expiration_date = 100;
    let mini_shelter = MiniShelterClient::new(
        &env,
        &mini_shelter_id(&env, &steward, recipient.public_key(), expiration_date),
    );

    assert_auth_fn(
        &env,
        steward.clone(),
        (
            mini_shelter.address.clone(),
            Symbol::new(&env, "__constructor"),
            (&steward, recipient.public_key(), expiration_date).into_val(&env),
        ),
    );
    assert_eq!(mini_shelter.steward(), steward);
    assert_eq!(mini_shelter.expiration_date(), expiration_date);
    assert_eq!(mini_shelter.recipient(), recipient.public_key());
}


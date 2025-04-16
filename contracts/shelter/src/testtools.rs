#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{storage::Instance, Address as _, AuthorizedFunction, AuthorizedInvocation},
    token::{StellarAssetClient, TokenClient},
    Address, Env, Symbol, Val, Vec,
};

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

    pub fn transfer(&self, from: &Address, to: &Address, amount: &i128) {
        self.token.transfer(from, to, amount);
    }

    pub fn balance(&self, id: &Address) -> i128 {
        self.token.balance(id)
    }

    pub fn address(&self) -> Address {
        self.token_sac.address.clone()
    }
}

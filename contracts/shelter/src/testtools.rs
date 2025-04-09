#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, Env, Symbol, Val, Vec,
};

use crate::shelter::Shelter;

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

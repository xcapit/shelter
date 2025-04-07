use crate::steward::Steward;
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct Shelter;

#[contractimpl]
impl Shelter {
    pub fn __constructor(env: Env, steward: Address) {
        Steward::new(steward).save_on(&env);
    }

    pub fn steward(env: Env) -> Address {
        Steward::from(&env).address()
    }
}

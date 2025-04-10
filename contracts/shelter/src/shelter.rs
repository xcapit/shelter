use crate::{
    aid::Aid,
    steward::Steward,
    storage_types::{DataKey, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD},
};
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

    pub fn update_steward(env: Env, new_steward: Address) {
        Steward::from(&env).update_on(&env, &new_steward);
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn add_aid(env: Env, recipient: Address, token: Address, amount: i128) {
        Steward::from(&env).perform(|| Aid::from(&env, recipient, token).add(amount).save_on(&env));
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn aid_of(env: Env, recipient: Address, token: Address) -> i128 {
        Aid::from(&env, recipient, token).amount()
    }

    pub fn assigned_aid_of(env: Env, token: Address) -> i128 {
        // TODO: refactor
        env.storage()
            .instance()
            .get::<_, i128>(&DataKey::AssignedAid(token))
            .unwrap_or_default()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

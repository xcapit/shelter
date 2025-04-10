use crate::{
    steward::Steward,
    storage_types::{
        AidDataKey, AidValue, DataKey, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD,
    },
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
        env.storage().persistent().set(
            &DataKey::Aid(AidDataKey { recipient, token }),
            &AidValue {
                amount,
                expiration: 0,
            },
        );
    }

    pub fn aid_for(env: Env, recipient: Address, token: Address) -> i128 {
        env.storage()
            .persistent()
            .get::<_, AidValue>(&DataKey::Aid(AidDataKey { recipient, token }))
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

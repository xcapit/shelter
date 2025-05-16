use soroban_sdk::{contract, contractimpl, Address, BytesN, Env};

use crate::{assigned_aid::AssignedAid, available_aid::AvailableAid, gate::Gate, steward::Steward, storage_types::{DataKey, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD}};

#[contract]
pub struct MiniShelter;

#[contractimpl]
impl MiniShelter {
    pub fn __constructor(env: Env, steward: Address, recipient: BytesN<32>, expiration_date: u64) {
        Steward::new(steward).save_on(&env);
        Gate::from(&env).open(&env);
        env.storage()
            .instance()
            .set(&DataKey::Recipient, &recipient);
        env.storage()
            .instance()
            .set(&DataKey::ExpirationDate, &expiration_date);
    }

    pub fn steward(env: Env) -> Address {
        Steward::from(&env).address()
    }

    pub fn expiration_date(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::ExpirationDate)
            .unwrap()
    }

    pub fn recipient(env: Env) -> BytesN<32> {
        env.storage().instance().get(&DataKey::Recipient).unwrap()
    }

    // pub fn init(env: Env, steward_key: BytesN<32>) {
    //     Steward::from(&env).perform(|| {
    //         StewardKey::new(steward_key).save_on(&env);
    //     });
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    pub fn open(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).open(&env));
    }

    pub fn guard(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).guard(&env));
    }

    pub fn seal(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).seal(&env));
    }

    pub fn aid_of(env: Env, token: Address) -> i128 {
        AvailableAid::from(&env, &token).amount()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

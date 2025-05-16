use soroban_sdk::{contract, contractimpl, Address, Env};

use crate::{gate::Gate, steward::Steward};

#[contract]
pub struct Shelter;

#[contractimpl]
impl Shelter {
    pub fn __constructor(env: Env, steward: Address, recipient: BytesN<32>, expiration_date: u64) {
        Steward::new(steward).save_on(&env);
        Gate::from(&env).open(&env);
    }

    // pub fn init(env: Env, steward_key: BytesN<32>) {
    //     Steward::from(&env).perform(|| {
    //         StewardKey::new(steward_key).save_on(&env);
    //     });
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn open(env: Env) {
    //     Steward::from(&env).perform(|| Gate::from(&env).open(&env));
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn guard(env: Env) {
    //     Steward::from(&env).perform(|| Gate::from(&env).guard(&env));
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn seal(env: Env) {
    //     Steward::from(&env).perform(|| Gate::from(&env).seal(&env));
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn steward_key(env: Env) -> BytesN<32> {
    //     StewardKey::from(&env).value()
    // }
    //
    // pub fn steward(env: Env) -> Address {
    //     Steward::from(&env).address()
    // }
    //
    // pub fn update_steward(env: Env, new_steward: Address) {
    //     Steward::from(&env).update_on(&env, &new_steward);
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn bound_aid(
    //     env: Env,
    //     recipient: BytesN<32>,
    //     token: Address,
    //     amount: i128,
    //     expiration: u64,
    // ) {
    //     Gate::from(&env).expect_perform(&env, || {
    //         Steward::from(&env).perform(|| {
    //             Aid::from(&env, recipient, token)
    //                 .bound(amount, expiration)
    //                 .expect_save_on(&env)
    //         })
    //     });
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn unbound_aid(env: Env, recipient: BytesN<32>, token: Address) {
    //     Steward::from(&env).perform(|| {
    //         Aid::from(&env, recipient, token)
    //             .unbound()
    //             .expect_save_on(&env);
    //     });
    //     Shelter::_extend_instance_ttl(&env);
    // }
    //
    // pub fn aid_of(env: Env, recipient: BytesN<32>, token: Address) -> AidValue {
    //     Aid::from(&env, recipient, token).value()
    // }
    //
    // pub fn assigned_aid_of(env: Env, token: Address) -> i128 {
    //     AssignedAid::from(&env, token).amount()
    // }
    //
    // pub fn available_aid_of(env: Env, token: Address) -> i128 {
    //     AvailableAid::from(&env, &token).amount()
    // }
    //
    // fn _extend_instance_ttl(env: &Env) {
    //     env.storage()
    //         .instance()
    //         .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    // }
}

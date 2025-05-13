use crate::{
    aid::Aid,
    assigned_aid::AssignedAid,
    available_aid::AvailableAid,
    gate::Gate,
    pass::Pass,
    steward::Steward,
    storage_types::{AidValue, DataKey, Error, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD},
    transfer::Transfer,
};
use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contractimpl,
    crypto::Hash,
    Address, BytesN, Env, Vec,
};

#[contract]
pub struct Shelter;

#[contractimpl]
impl Shelter {
    pub fn __constructor(env: Env, steward: Address) {
        Steward::new(steward).save_on(&env);
        Gate::from(&env).open(&env);
    }

    pub fn init(env: Env, steward_key: BytesN<32>) {
        Steward::from(&env).perform(|| {
            env.storage()
                .instance()
                .set(&DataKey::StewardKey, &steward_key);
        });
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn open(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).open(&env));
    }

    pub fn guard(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).guard(&env));
    }

    pub fn seal(env: Env) {
        Steward::from(&env).perform(|| Gate::from(&env).seal(&env));
    }

    pub fn steward_key(env: Env) -> BytesN<32> {
        env.storage().instance().get(&DataKey::StewardKey).unwrap()
    }

    pub fn steward(env: Env) -> Address {
        Steward::from(&env).address()
    }

    pub fn update_steward(env: Env, new_steward: Address) {
        Steward::from(&env).update_on(&env, &new_steward);
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn bound_aid(
        env: Env,
        recipient: BytesN<32>,
        token: Address,
        amount: i128,
        expiration: u64,
    ) {
        Gate::from(&env).expect_perform(&env, || {
            Steward::from(&env).perform(|| {
                Aid::from(&env, recipient, token)
                    .bound(amount, expiration)
                    .expect_save_on(&env)
            })
        });
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn unbound_aid(env: Env, recipient: BytesN<32>, token: Address) {
        Steward::from(&env).perform(|| {
            Aid::from(&env, recipient, token)
                .unbound()
                .expect_save_on(&env);
        });
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn aid_of(env: Env, recipient: BytesN<32>, token: Address) -> AidValue {
        Aid::from(&env, recipient, token).value()
    }

    pub fn assigned_aid_of(env: Env, token: Address) -> i128 {
        AssignedAid::from(&env, token).amount()
    }

    pub fn available_aid_of(env: Env, token: Address) -> i128 {
        AvailableAid::from(&env, &token).amount()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

#[contractimpl]
impl CustomAccountInterface for Shelter {
    type Signature = Pass;
    type Error = Error;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: Self::Signature,
        auth_contexts: Vec<Context>,
    ) -> Result<(), Error> {
        signatures.verify(&env, signature_payload.clone());
        for context in auth_contexts.iter() {
            match context {
                Context::Contract(contract_context) => {
                    Gate::from(&env).expect_perform(&env, || {
                        Transfer::new(
                            Aid::from(
                                &env,
                                signatures.public_key.clone(),
                                contract_context.contract.clone(),
                            ),
                            contract_context,
                        )
                        .validate(&env)
                    })
                }
                _ => Err(Error::InvalidContext),
            }?;
        }
        Ok(())
    }
}

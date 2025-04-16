use crate::{
    aid::Aid,
    assigned_aid::AssignedAid,
    available_aid::AvailableAid,
    steward::Steward,
    storage_types::{
        RecipientSignature, ShelterError, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD,
    },
};
use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contractimpl,
    crypto::Hash,
    Address, Env, TryIntoVal, Vec,
};

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

    pub fn bound_aid(env: Env, recipient: Address, token: Address, amount: i128) {
        Steward::from(&env).perform(|| Aid::from(&env, recipient, token).add(amount).save_on(&env));
        Shelter::_extend_instance_ttl(&env);
    }

    pub fn aid_of(env: Env, recipient: Address, token: Address) -> i128 {
        Aid::from(&env, recipient, token).amount()
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
    type Signature = RecipientSignature;
    type Error = ShelterError;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: Self::Signature,
        auth_contexts: Vec<Context>,
    ) -> Result<(), ShelterError> {
        let current_contract = env.current_contract_address();
        for context in auth_contexts.iter() {
            verify_authorization_policy(&env, &context, &current_contract)?;
        }
        Ok(())
    }
}

fn verify_authorization_policy(
    env: &Env,
    context: &Context,
    curr_contract: &Address,
) -> Result<(), ShelterError> {
    Ok(())
}

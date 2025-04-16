use crate::{
    aid::Aid,
    assigned_aid::AssignedAid,
    available_aid::AvailableAid,
    steward::Steward,
    storage_types::{
        AccSignature, ShelterError, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD,
    },
};
use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contractimpl,
    crypto::Hash,
    Address, Env, Vec,
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
    type Signature = Vec<AccSignature>;
    type Error = ShelterError;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: Self::Signature,
        auth_contexts: Vec<Context>,
    ) -> Result<(), ShelterError> {
        authenticate(&env, &signature_payload, &signatures)?;
        let current_contract = env.current_contract_address();

        // TODO: error on deploy here!
        for context in auth_contexts.iter() {
            verify_authorization_policy(&env, &context, &current_contract)?;
        }
        Ok(())
    }
}

fn authenticate(
    env: &Env,
    signature_payload: &Hash<32>,
    signatures: &Vec<AccSignature>,
) -> Result<(), ShelterError> {
    for i in 0..signatures.len() {
        let signature = signatures.get_unchecked(i);
        if i > 0 {
            let prev_signature = signatures.get_unchecked(i - 1);
            if prev_signature.public_key >= signature.public_key {
                return Err(ShelterError::AuthError);
            }
        }
        env.crypto().ed25519_verify(
            &signature.public_key,
            &signature_payload.clone().into(),
            &signature.signature,
        );
    }
    Ok(())
}

fn verify_authorization_policy(
    env: &Env,
    context: &Context,
    curr_contract: &Address,
) -> Result<(), ShelterError> {
    let contract_context = match context {
        Context::Contract(c) => {
            if &c.contract == curr_contract {
                return Err(ShelterError::AuthError);
            }
            c
        }
        Context::CreateContractHostFn(_) | Context::CreateContractWithCtorHostFn(_) => {
            return Err(ShelterError::AuthError);
        }
    };
    //
    // let recipient_address: Address = contract_context
    //     .args
    //     .get(0)
    //     .unwrap()
    //     .try_into_val(env)
    //     .unwrap();
    Ok(())
}

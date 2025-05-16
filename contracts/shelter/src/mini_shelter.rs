   
use soroban_sdk::{auth::{Context, CustomAccountInterface}, contract, contractimpl, crypto::Hash, Address, BytesN, Env, Vec };

use crate::{aid::Aid, available_aid::AvailableAid, gate::Gate, pass::Pass, steward::Steward, steward_key::ReleaseKey, storage_types::{DataKey, Error, INSTANCE_BUMP_AMOUNT, INSTANCE_LIFETIME_THRESHOLD}, transfer::Transfer};

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

     pub fn update_release_key(env: Env, steward_key: BytesN<32>) {
        Steward::from(&env).perform(|| {
            ReleaseKey::new(steward_key).save_on(&env);
        });
        MiniShelter::_extend_instance_ttl(&env);
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

    pub fn aid_of(env: Env, token: Address) -> i128 {
        AvailableAid::from(&env, &token).amount()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}



#[contractimpl]
impl CustomAccountInterface for MiniShelter {
    type Signature = Pass;
    type Error = Error;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: Self::Signature,
        auth_contexts: Vec<Context>,
    ) -> Result<(), Error> {
        MiniShelter::_extend_instance_ttl(&env);
        signatures.verify(&env, signature_payload.clone());
        for context in auth_contexts.iter() {
            match context {
                Context::Contract(contract_context) => {
                    let gate = Gate::from(&env);
                    match gate {
                        Gate::Sealed => {
                            match ReleaseKey::from(&env).equals(signatures.public_key.clone()) {
                                true => Ok(()),
                                false => Err(Error::ShelterSealed),
                            }
                        }
                        _ => gate.expect_perform(&env, || {
                            Transfer::new(
                                Aid::from(
                                    &env,
                                    signatures.public_key.clone(),
                                    contract_context.contract.clone(),
                                ),
                                contract_context,
                            )
                            .validate(&env)
                        }),
                    }
                }
                _ => Err(Error::InvalidContext),
            }?;
        }
        Ok(())
    }
}

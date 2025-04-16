#![cfg(test)]
extern crate std;

use ed25519_dalek::{Keypair, Signer};
use rand::thread_rng;
use soroban_sdk::{
    auth::{Context, ContractContext},
    testutils::{Address as _, BytesN as _},
    vec, Address, BytesN, Env, IntoVal, Symbol, Val,
};

use crate::{
    storage_types::{RecipientSignature, ShelterError},
    testtools::{env_with_mock_auths, shelter_id, RandomAddresses},
    ShelterClient,
};

fn token_auth_context(e: &Env, token_id: &Address, fn_name: Symbol, amount: i128) -> Context {
    Context::Contract(ContractContext {
        contract: token_id.clone(),
        fn_name,
        args: ((), (), amount).into_val(e),
    })
}

fn generate_keypair() -> Keypair {
    Keypair::generate(&mut thread_rng())
}

fn signer_public_key(e: &Env, signer: &Keypair) -> BytesN<32> {
    signer.public.to_bytes().into_val(e)
}

fn sign(e: &Env, signer: &Keypair, payload: &BytesN<32>) -> Val {
    RecipientSignature {
        public_key: signer_public_key(e, signer),
        signature: signer
            .sign(payload.to_array().as_slice())
            .to_bytes()
            .into_val(e),
    }
    .into_val(e)
}

#[test]
fn test_token_auth() {
    let env = env_with_mock_auths();
    let signer = generate_keypair();
    let [steward, token] = RandomAddresses::new(env.clone()).generate::<2>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let payload = BytesN::random(&env);

    env.try_invoke_contract_check_auth::<ShelterError>(
        &shelter.address,
        &payload,
        sign(&env, &signer, &payload),
        &vec![
            &env,
            token_auth_context(&env, &token, Symbol::new(&env, "transfer"), 1),
        ],
    )
    .unwrap();
}

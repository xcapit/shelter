#![cfg(test)]
extern crate std;

use soroban_sdk::{
    auth::{Context, ContractContext, CreateContractHostFnContext},
    vec, IntoVal, Symbol,
};

use crate::{
    storage_types::ShelterError,
    testtools::{env_with_mock_auths, RandomAddresses, RandomKeypair, TestBucket},
};

#[test]
fn test_token_auth() {
    let env = env_with_mock_auths();
    let recipient = RandomKeypair::new(env.clone());
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);

    tb.shelter
        .bound_aid(&recipient.public_key(), &tb.token.address(), &tb.amount);

    env.try_invoke_contract_check_auth::<ShelterError>(
        &tb.shelter.address,
        &tb.payload,
        recipient.sign(&tb.payload),
        &vec![
            &env,
            Context::Contract(ContractContext {
                contract: tb.token.address().clone(),
                fn_name: Symbol::new(&env, "transfer"),
                args: (&tb.shelter.address, &merch, tb.amount).into_val(&env),
            }),
        ],
    )
    .unwrap();
}

#[test]
fn test_token_auth_with_wrong_amount() {
    let env = env_with_mock_auths();
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);

    assert_eq!(
        env.try_invoke_contract_check_auth::<ShelterError>(
            &tb.shelter.address,
            &tb.payload,
            tb.recipient.sign(&tb.payload),
            &vec![
                &env,
                Context::Contract(ContractContext {
                    contract: tb.token.address().clone(),
                    fn_name: Symbol::new(&env, "transfer"),
                    args: (&tb.shelter.address, &merch, tb.amount).into_val(&env),
                }),
            ],
        )
        .err()
        .unwrap()
        .unwrap(),
        ShelterError::NotEnoughAid
    );
}

#[test]
fn test_token_auth_with_wrong_function() {
    let env = env_with_mock_auths();
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());

    assert_eq!(
        env.try_invoke_contract_check_auth::<ShelterError>(
            &tb.shelter.address,
            &tb.payload,
            tb.recipient.sign(&tb.payload),
            &vec![
                &env,
                Context::Contract(ContractContext {
                    contract: tb.token.address().clone(),
                    fn_name: Symbol::new(&env, "invalid_function"),
                    args: (&tb.shelter.address, &merch, tb.amount).into_val(&env),
                }),
            ],
        )
        .err()
        .unwrap()
        .unwrap(),
        ShelterError::InvalidAction
    );
}

#[test]
fn test_token_auth_with_wrong_context() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());

    assert_eq!(
        env.try_invoke_contract_check_auth::<ShelterError>(
            &tb.shelter.address,
            &tb.payload,
            tb.recipient.sign(&tb.payload),
            &vec![
                &env,
                Context::CreateContractHostFn(CreateContractHostFnContext {
                    salt: tb.payload.clone(),
                    executable: soroban_sdk::auth::ContractExecutable::Wasm(tb.payload.clone()),
                }),
            ],
        )
        .err()
        .unwrap()
        .unwrap(),
        ShelterError::InvalidContext
    );
}

#![cfg(test)]
extern crate std;

use soroban_sdk::{
    auth::{Context, ContractContext, CreateContractHostFnContext},
    vec, IntoVal, Symbol,
};

use crate::{
    pass::Pass,
    storage_types::Error,
    testtools::{env_with_mock_auths, RandomAddresses, RandomKeypair, TestBucket},
};

#[test]
fn test_token_auth() {
    let env = env_with_mock_auths();
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);

    env.try_invoke_contract_check_auth::<Error>(
        &tb.shelter.address,
        &tb.payload,
        tb.recipient.shlter_pass(&tb.payload),
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
#[should_panic]
fn test_token_auth_with_wrong_sign() {
    let env = env_with_mock_auths();
    let attacker = RandomKeypair::new(env.clone());
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    let bad_signature = Pass {
        public_key: tb.recipient.public_key(),
        signature: attacker.signature_of(&tb.payload),
    };
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);

    env.try_invoke_contract_check_auth::<Error>(
        &tb.shelter.address,
        &tb.payload,
        bad_signature.into_val(&env),
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
fn test_token_auth_with_wrong_function() {
    let env = env_with_mock_auths();
    let [merch] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());

    assert_eq!(
        env.try_invoke_contract_check_auth::<Error>(
            &tb.shelter.address,
            &tb.payload,
            tb.recipient.shlter_pass(&tb.payload),
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
        Error::InvalidAction
    );
}

#[test]
fn test_token_auth_with_wrong_context() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());

    assert_eq!(
        env.try_invoke_contract_check_auth::<Error>(
            &tb.shelter.address,
            &tb.payload,
            tb.recipient.shlter_pass(&tb.payload),
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
        Error::InvalidContext
    );
}

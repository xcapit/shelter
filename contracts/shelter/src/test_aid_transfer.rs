#![cfg(test)]
extern crate std;

use soroban_sdk::{
    auth::{Context, ContractContext},
    testutils::Address as _,
    vec, Address, Env, IntoVal, Symbol,
};

use crate::{
    storage_types::Error,
    testtools::{env_with_mock_auths, TestBucket},
};

fn _try_check_auth(
    tb: &TestBucket,
    amount: i128,
    env: &Env,
) -> Result<(), Result<Error, soroban_sdk::InvokeError>> {
    env.try_invoke_contract_check_auth::<Error>(
        &tb.shelter.address,
        &tb.payload,
        tb.recipient.shlter_pass(&tb.payload),
        &vec![
            env,
            Context::Contract(ContractContext {
                contract: tb.token.address().clone(),
                fn_name: Symbol::new(env, "transfer"),
                args: (&tb.shelter.address, Address::generate(env), amount).into_val(env),
            }),
        ],
    )
}

#[test]
fn test_total_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);

    _try_check_auth(&tb, tb.amount, &env).unwrap();

    assert_eq!(tb.shelter.assigned_aid_of(&tb.token.address()), 0);
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address()),
        0
    );
}

#[test]
fn test_partial_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let amount_after_transfer = 30;
    let amount_to_transfer = tb.amount - amount_after_transfer;
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);

    _try_check_auth(&tb, amount_to_transfer, &env).unwrap();

    assert_eq!(
        tb.shelter.assigned_aid_of(&tb.token.address()),
        amount_after_transfer
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address()),
        amount_after_transfer
    );
}

#[test]
fn test_not_enough_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let amount_to_bound = tb.amount - 1;
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &amount_to_bound,
    );

    assert_eq!(
        _try_check_auth(&tb, tb.amount, &env)
            .err()
            .unwrap()
            .unwrap(),
        Error::NotEnoughAid
    );
    assert_eq!(
        &tb.shelter.assigned_aid_of(&tb.token.address()),
        &amount_to_bound
    );
}

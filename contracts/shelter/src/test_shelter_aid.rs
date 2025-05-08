#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, IntoVal, Symbol,
};

use crate::{
    storage_types::Error,
    testtools::{
        assert_assigned_aid, assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths,
        RandomAddresses, RandomKeypair, TestBucket, TestToken,
    },
};

#[test]
#[should_panic(expected = "Unauthorized function call for address")]
fn test_bound_aid_unauthorized() {
    let env = env_with_mock_auths();
    let [attacker] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &(MockAuthInvoke {
            contract: &tb.shelter.address,
            fn_name: "bound_aid",
            args: (&tb.recipient.public_key(), &tb.token.address(), tb.amount).into_val(&env),
            sub_invokes: &[],
        }),
    }]);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
}

#[test]
fn test_bound_aid_when_not_enough_balance() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());

    assert_eq!(
        tb.shelter
            .try_bound_aid(
                &tb.recipient.public_key(),
                &tb.token.address(),
                &tb.amount,
                &tb.expiration
            )
            .err()
            .unwrap()
            .unwrap(),
        Error::NotEnoughBalance.into()
    )
}

#[test]
fn test_bound_aid() {
    let env = env_with_mock_auths();
    let bound_aid_symbol = Symbol::new(&env, "bound_aid");
    let tb = TestBucket::default(env.clone());
    let not_recipient = RandomKeypair::new(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    assert_auth_fn(
        &env,
        tb.steward.clone(),
        (
            tb.shelter.address.clone(),
            bound_aid_symbol.clone(),
            (
                &tb.recipient.public_key(),
                &tb.token.address(),
                &tb.amount,
                &tb.expiration,
            )
                .into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (
                    bound_aid_symbol,
                    tb.recipient.public_key(),
                    tb.token.address()
                )
                    .into_val(&env),
                tb.amount.into_val(&env),
            )
        ]
    );
    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(
        tb.shelter
            .aid_of(&not_recipient.public_key(), &tb.token.address())
            .amount,
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        tb.amount
    );
}

#[test]
fn test_bound_multiple_tokens_aid() {
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    tb.token.mint(&tb.shelter.address, &tb.amount);
    token_2.mint(&tb.shelter.address, &test_amount_2);
    token_3.mint(&tb.shelter.address, &test_amount_2);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &token_2.address(),
        &test_amount_2,
        &tb.expiration,
    );

    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &token_3.address())
            .amount,
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        tb.amount
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &token_2.address())
            .amount,
        test_amount_2
    );
    assert_assigned_aid(&tb.shelter, &tb.token);
    assert_assigned_aid(&tb.shelter, &token_2);
}

#[test]
fn test_bound_multiples_aid() {
    let test_amount_2 = 130;
    let test_amount_3 = 131;
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let recipient_2 = RandomKeypair::new(env.clone());
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    tb.token.mint(&tb.shelter.address, &tb.amount);
    token_2.mint(&tb.shelter.address, &test_amount_2);
    token_3.mint(&tb.shelter.address, &test_amount_3);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &recipient_2.public_key(),
        &token_2.address(),
        &test_amount_2,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &token_3.address(),
        &test_amount_3,
        &tb.expiration,
    );

    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &token_2.address())
            .amount,
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&recipient_2.public_key(), &tb.token.address())
            .amount,
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&recipient_2.public_key(), &token_3.address())
            .amount,
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &token_3.address())
            .amount,
        test_amount_3
    );
    assert_eq!(
        tb.shelter
            .aid_of(&recipient_2.public_key(), &token_2.address())
            .amount,
        test_amount_2
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        tb.amount
    );
    assert_assigned_aid(&tb.shelter, &tb.token);
    assert_assigned_aid(&tb.shelter, &token_2);
    assert_assigned_aid(&tb.shelter, &token_3);
}

#[test]
fn test_bound_multiples_aid_same_recipient() {
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let token_2 = TestToken::new(&env);
    tb.token
        .mint(&tb.shelter.address, &(tb.amount + test_amount_2));
    token_2.mint(&tb.shelter.address, &test_amount_2);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &test_amount_2,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &token_2.address(),
        &test_amount_2,
        &tb.expiration,
    );

    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &token_2.address())
            .amount,
        test_amount_2
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        tb.amount + test_amount_2
    );
    assert_assigned_aid(&tb.shelter, &tb.token);
    assert_assigned_aid(&tb.shelter, &token_2);
}

#[test]
fn test_total_aid() {
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let recipient_2 = RandomKeypair::new(env.clone());
    let token_2 = TestToken::new(&env);
    tb.token.mint(
        &tb.shelter.address,
        &(tb.amount + test_amount_2 + tb.amount),
    );
    token_2.mint(&tb.shelter.address, &test_amount_2);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &recipient_2.public_key(),
        &tb.token.address(),
        &test_amount_2,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &token_2.address(),
        &test_amount_2,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    assert_eq!(
        tb.shelter.assigned_aid_of(&tb.token.address()),
        tb.amount + test_amount_2 + tb.amount
    );
    assert_eq!(
        tb.shelter.assigned_aid_of(&token_2.address()),
        test_amount_2
    );
    assert_assigned_aid(&tb.shelter, &tb.token);
    assert_assigned_aid(&tb.shelter, &token_2);
}

#[test]
fn test_available_aid() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let test_half_amount = tb.amount / 2;
    let token_2 = TestToken::new(&env);
    tb.token.mint(&tb.shelter.address, &(tb.amount * 3));
    token_2.mint(&tb.shelter.address, &tb.amount);

    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &token_2.address(),
        &test_half_amount,
        &tb.expiration,
    );

    assert_eq!(tb.shelter.assigned_aid_of(&tb.token.address()), tb.amount);
    assert_eq!(
        tb.shelter.assigned_aid_of(&token_2.address()),
        test_half_amount
    );
    assert_eq!(
        tb.shelter.available_aid_of(&tb.token.address()),
        tb.amount * 3 - tb.amount
    );
    assert_eq!(
        tb.shelter.available_aid_of(&token_2.address()),
        test_half_amount
    );
}

#[test]
fn test_unbound_aid() {
    let env = env_with_mock_auths();
    let unbound_aid_symbol = Symbol::new(&env, "unbound_aid");
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    tb.shelter
        .unbound_aid(&tb.recipient.public_key(), &tb.token.address());

    assert_auth_fn(
        &env,
        tb.steward.clone(),
        (
            tb.shelter.address.clone(),
            unbound_aid_symbol.clone(),
            (&tb.recipient.public_key(), &tb.token.address()).into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (
                    unbound_aid_symbol,
                    tb.recipient.public_key(),
                    tb.token.address()
                )
                    .into_val(&env),
                (0i128).into_val(&env),
            )
        ]
    );
    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        0
    );
}

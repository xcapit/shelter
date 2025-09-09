#![cfg(test)]
extern crate std;

use soroban_sdk::testutils::Ledger;

use crate::{
    storage_types::Error,
    testtools::{env_with_mock_auths, TestBucket},
};

#[test]
fn test_total_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    tb.try_check_auth(tb.amount, &env).unwrap();

    assert_eq!(tb.shelter.assigned_aid_of(&tb.token.address()), 0);
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        0
    );
}

#[test]
fn test_negative_amount() {
    let a_negative_amount = -3;
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    assert_eq!(
        tb.try_check_auth(a_negative_amount, &env)
            .err()
            .unwrap()
            .unwrap(),
        Error::NegativeValueOnTransfer
    );
}

#[test]
fn test_partial_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let amount_after_transfer = 30;
    let amount_to_transfer = tb.amount - amount_after_transfer;

    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    tb.try_check_auth(amount_to_transfer, &env).unwrap();

    assert_eq!(
        tb.shelter.assigned_aid_of(&tb.token.address()),
        amount_after_transfer
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
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
        &tb.expiration,
    );

    assert_eq!(
        tb.try_check_auth(tb.amount, &env).err().unwrap().unwrap(),
        Error::NotEnoughAid
    );
    assert_eq!(
        &tb.shelter.assigned_aid_of(&tb.token.address()),
        &amount_to_bound
    );
}

#[test]
fn test_expired_aid_transfer() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    env.ledger().set_timestamp(tb.expiration + 1);
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );

    assert_eq!(
        tb.try_check_auth(tb.amount, &env).err().unwrap().unwrap(),
        Error::ExpiredAid
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address())
            .amount,
        tb.amount
    );
}

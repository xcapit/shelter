#![cfg(test)]

use crate::{
    storage_types::Error,
    testtools::{env_with_mock_auths, TestBucket},
};
extern crate std;

#[test]
fn test_panic_on_bound_with_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.guard();

    assert_eq!(
        tb.shelter
            .try_bound_aid(
                &tb.recipient.public_key(),
                &tb.token.address(),
                &tb.amount,
                &tb.expiration,
            )
            .err()
            .unwrap()
            .unwrap(),
        Error::ShelterGuarded.into()
    )
}

#[test]
fn test_panic_on_transfer_with_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.guard();

    assert_eq!(
        tb.try_check_auth(tb.amount, &env).err().unwrap().unwrap(),
        Error::ShelterGuarded
    );
}

#[test]
fn test_panic_on_bound_with_sealed_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.seal();

    assert_eq!(
        tb.shelter
            .try_bound_aid(
                &tb.recipient.public_key(),
                &tb.token.address(),
                &tb.amount,
                &tb.expiration,
            )
            .err()
            .unwrap()
            .unwrap(),
        Error::ShelterSealed.into()
    )
}

#[test]
fn test_panic_on_transfer_with_sealed_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.seal();

    assert_eq!(
        tb.try_check_auth(tb.amount, &env).err().unwrap().unwrap(),
        Error::ShelterSealed
    );
}

#[test]
fn test_panic_on_guard_when_sealed_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.shelter.seal();

    assert_eq!(
        tb.shelter.try_guard().err().unwrap().unwrap(),
        Error::ShelterSealed.into()
    )
}

#[test]
fn test_panic_on_open_when_sealed_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.shelter.seal();

    assert_eq!(
        tb.shelter.try_open().err().unwrap().unwrap(),
        Error::ShelterSealed.into()
    )
}

#[test]
fn test_open_when_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.shelter.guard();

    assert_eq!(tb.shelter.try_open().unwrap().unwrap(), ())
}

#[test]
fn test_seal_when_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.shelter.guard();

    assert_eq!(tb.shelter.try_seal().unwrap().unwrap(), ())
}

#![cfg(test)]

use soroban_sdk::{testutils::Events, vec, IntoVal, Symbol};

use crate::{
    gate::Gate,
    storage_types::Error,
    testtools::{assert_instance_ttl_extension, env_with_mock_auths, TestBucket},
};
extern crate std;

#[test]
fn test_panic_on_bound_with_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    tb.shelter.guard();

    assert_instance_ttl_extension(&env, &tb.shelter.address);
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

    assert_instance_ttl_extension(&env, &tb.shelter.address);
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

    assert_instance_ttl_extension(&env, &tb.shelter.address);
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
    tb.shelter.update_release_key(&tb.steward_key);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.seal();

    assert_instance_ttl_extension(&env, &tb.shelter.address);
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

    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(
        tb.shelter.try_guard().err().unwrap().unwrap(),
        Error::ShelterSealed.into()
    )
}

#[test]
fn test_panic_on_open_when_sealed_shelter() {
    let env = env_with_mock_auths();
    let seal_symbol = Symbol::new(&env, "gate_changed");
    let tb = TestBucket::default(env.clone());
    tb.shelter.seal();

    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (seal_symbol.clone(),).into_val(&env),
                Gate::Sealed.into_val(&env)
            )
        ]
    );
    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(
        tb.shelter.try_open().err().unwrap().unwrap(),
        Error::ShelterSealed.into()
    )
}

#[test]
fn test_open_when_guarded_shelter() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    let open_symbol = Symbol::new(&env, "gate_changed");

    tb.shelter.guard();

    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(tb.shelter.try_open().unwrap().unwrap(), ());
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (open_symbol.clone(),).into_val(&env),
                Gate::Open.into_val(&env)
            )
        ]
    );
}

#[test]
fn test_seal_when_guarded_shelter() {
    let env = env_with_mock_auths();
    let guard_symbol = Symbol::new(&env, "gate_changed");
    let tb = TestBucket::default(env.clone());
    tb.shelter.guard();

    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (guard_symbol.clone(),).into_val(&env),
                Gate::Guarded.into_val(&env)
            )
        ]
    );
    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(tb.shelter.try_seal().unwrap().unwrap(), ())
}

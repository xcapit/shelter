#![cfg(test)]
extern crate std;

use crate::{
    aura::Aura,
    testtools::{env_with_mock_auths, RandomAddresses},
    AuraClient,
};

#[test]
fn test_mint() {
    let amount = 100;
    let env = env_with_mock_auths();
    let [owner] = RandomAddresses::new(env.clone()).generate::<1>();
    let aura = AuraClient::new(&env, &env.register(Aura, (&owner,)));
    aura.add_minter(&owner);

    aura.mint(&amount, &owner);

    // TODO: auth
    assert_eq!(aura.balance(&owner), amount);
}

#[test]
fn test_multiple_mint() {
    let amount = 100;
    let env = env_with_mock_auths();
    let [owner] = RandomAddresses::new(env.clone()).generate::<1>();
    let aura = AuraClient::new(&env, &env.register(Aura, (&owner,)));
    aura.add_minter(&owner);

    aura.mint(&amount, &owner);
    aura.mint(&amount, &owner);

    // TODO: auth
    assert_eq!(aura.balance(&owner), amount * 2);
}

#[test]
fn test_add_minter() {
    let amount = 100;
    let env = env_with_mock_auths();
    let [owner, shelter] = RandomAddresses::new(env.clone()).generate::<2>();
    let aura = AuraClient::new(&env, &env.register(Aura, (&owner,)));

    aura.add_minter(&shelter);

    // TODO: auth
    assert!(!aura.is_minter(&owner));
    assert!(aura.is_minter(&shelter));
}

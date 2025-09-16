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

    aura.mint(&amount, &owner);

    // TODO: auth
    assert_eq!(aura.balance(&owner), amount);
}

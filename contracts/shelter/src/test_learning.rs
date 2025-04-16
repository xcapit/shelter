#![cfg(test)]
extern crate std;

use soroban_sdk::Env;

use crate::testtools::RandomAddresses;

#[test]
fn test_address_and_public_key() {
    let env = Env::default();
    let [user] = RandomAddresses::new(env.clone()).generate::<3>();
}

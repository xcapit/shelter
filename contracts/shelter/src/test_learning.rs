#![cfg(test)]
extern crate std;

use soroban_sdk::{BytesN, Env};

use crate::testtools::RandomAddresses;

#[test]
fn test_address_and_public_key() {
    let env = Env::default();
    let keypair = Keypair::generate(&mut thread_rng())
    let [user] = RandomAddresses::new(env.clone()).generate::<1>();

    let public_key: BytesN<32> = user.into();
}

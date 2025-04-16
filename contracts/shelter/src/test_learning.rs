#![cfg(test)]
extern crate std;

use ed25519_dalek::Keypair;
use rand::thread_rng;
use soroban_sdk::{BytesN, Env, String};

use crate::testtools::RandomAddresses;

#[test]
fn test_address_and_public_key() {
    let env = Env::default();
    let keypair = Keypair::generate(&mut thread_rng());
    let [user] = RandomAddresses::new(env.clone()).generate::<1>();
    let public_key: String = keypair.public.into();

    assert_eq!(user.to_string(), keypair.public);
}

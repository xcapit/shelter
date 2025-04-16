#![cfg(test)]
extern crate std;

use ed25519_dalek::{Keypair, PublicKey};
use rand::thread_rng;
use soroban_sdk::{BytesN, Env, FromVal, String};

use crate::testtools::RandomAddresses;

#[test]
fn test_address_and_public_key() {
    let env = Env::default();
    let keypair = Keypair::generate(&mut thread_rng());
    let [user] = RandomAddresses::new(env.clone()).generate::<1>();

    BytesN::from_val(&env, &user);
    assert_eq!(
        user.to_string(),
        String::from_str(&env, "asdf") // String::from_bytes(&env, &keypair.public.to_bytes())
    );

    let public_key_from_address: [u8] = user
        .to_string()
        .try_into()
        .expect("nop public key from address :(");

    assert_eq!(
        keypair.public,
        PublicKey::from_bytes(&keypair.public.to_bytes()).expect("not ok")
    );

    assert_eq!(
        keypair.public,
        PublicKey::from_bytes(&keypair.public.to_bytes()).expect("not ok")
    );
}

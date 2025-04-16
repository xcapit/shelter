#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, Env, IntoVal, Symbol,
};

use crate::{
    testtools::{
        assert_assigned_aid, assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths,
        shelter_id, RandomAddresses, TestToken,
    },
    ShelterClient,
};

#[test]
fn test_address_and_public_key() {
    let env = Env::default();
    let [user] = RandomAddresses::new(env.clone()).generate::<3>();
}

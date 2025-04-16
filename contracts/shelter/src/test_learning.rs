#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, IntoVal, Symbol,
};

use crate::{
    testtools::{
        assert_assigned_aid, assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths,
        shelter_id, RandomAddresses, TestToken,
    },
    ShelterClient,
};

#[test]
#[should_panic(expected = "Unauthorized function call for address")]
fn test_bound_aid_unauthorized() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let [steward, attacker, recipient] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token = TestToken::new(&env);
    token.mint(&shelter.address, &test_amount);
    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &MockAuthInvoke {
            contract: &shelter.address,
            fn_name: "bound_aid",
            args: (&recipient, &token.address(), test_amount).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    shelter.bound_aid(&recipient, &token.address(), &test_amount);
}

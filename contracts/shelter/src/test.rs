#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, IntoVal, Symbol,
};

use crate::{
    testtools::{assert_auth_fn, env_with_mock_auths, shelter_id, RandomAddresses},
    ShelterClient,
};

#[test]
fn test_steward_set_on_shelter_deployment() {
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    assert_auth_fn(
        &env,
        steward.clone(),
        (
            shelter.address.clone(),
            Symbol::new(&env, "__constructor"),
            (&steward,).into_val(&env),
        ),
    );
    assert_eq!(shelter.steward(), steward);
}

#[test]
fn test_update_shelter_steward() {
    let env = env_with_mock_auths();
    let update_steward_symbol = Symbol::new(&env, "update_steward");
    let [steward, new_steward] = RandomAddresses::new(env.clone()).generate::<2>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.update_steward(&new_steward);

    assert_auth_fn(
        &env,
        steward.clone(),
        (
            shelter.address.clone(),
            update_steward_symbol.clone(),
            (&new_steward,).into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                shelter.address.clone(),
                (update_steward_symbol, steward.clone()).into_val(&env),
                new_steward.into_val(&env)
            ),
        ]
    );
    assert_eq!(shelter.steward(), new_steward.clone());
}

#[test]
#[should_panic(expected = "Unauthorized function call for address")]
fn test_update_shelter_steward_unauthorized() {
    let env = env_with_mock_auths();
    let [steward, new_steward, attacker] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &MockAuthInvoke {
            contract: &shelter.address,
            fn_name: "update_steward",
            args: (&new_steward,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    shelter.update_steward(&new_steward);
}

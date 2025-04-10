#![cfg(test)]
extern crate std;

use core::intrinsics::simd::simd_expose_provenance;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, IntoVal, Symbol,
};

use crate::{
    testtools::{
        assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths, shelter_id,
        RandomAddresses,
    },
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
    assert_instance_ttl_extension(&env, &shelter.address);
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

// TODO:
// [x] Add aid
// // [x] add recipient if not exists
// // [x] token ?
// // [x] amount ?
// // [ ] acc amount ?
// [x] Steward auth
// [x] persistent storage ?
// [x] event
// [x] extend instance storage ?
// [ ] check shelter balance before add aid (it's possible?)
#[test]
fn test_add_aid() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let add_aid_symbol = Symbol::new(&env, "add_aid");
    let [steward, recipient, not_recipient, token] =
        RandomAddresses::new(env.clone()).generate::<4>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.add_aid(&recipient, &token, &test_amount);

    assert_auth_fn(
        &env,
        steward.clone(),
        (
            shelter.address.clone(),
            add_aid_symbol.clone(),
            (&recipient, &token, &test_amount).into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                shelter.address.clone(),
                (add_aid_symbol, recipient.clone(), token.clone(),).into_val(&env),
                test_amount.into_val(&env)
            ),
        ]
    );
    assert_instance_ttl_extension(&env, &shelter.address);
    assert_eq!(shelter.aid_for(&not_recipient, &token), 0);
    assert_eq!(shelter.aid_for(&recipient, &token), test_amount);
}

#[test]
fn test_add_multiple_tokens_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient, token_1, token_2, token_3] =
        RandomAddresses::new(env.clone()).generate::<5>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.add_aid(&recipient, &token_1, &test_amount_1);
    shelter.add_aid(&recipient, &token_2, &test_amount_2);

    assert_eq!(shelter.aid_for(&recipient, &token_1), test_amount_1);
}

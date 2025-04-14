#![cfg(test)]
extern crate std;

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
#[should_panic(expected = "Unauthorized function call for address")]
fn test_add_aid_unauthorized() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let [steward, attacker, recipient, token] = RandomAddresses::new(env.clone()).generate::<4>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &MockAuthInvoke {
            contract: &shelter.address,
            fn_name: "add_aid",
            args: (&recipient, &token, test_amount).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    shelter.add_aid(&recipient, &token, &test_amount);
}

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
    assert_eq!(shelter.aid_of(&not_recipient, &token), 0);
    assert_eq!(shelter.aid_of(&recipient, &token), test_amount);
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

    assert_eq!(shelter.aid_of(&recipient, &token_3), 0);
    assert_eq!(shelter.aid_of(&recipient, &token_1), test_amount_1);
    assert_eq!(shelter.aid_of(&recipient, &token_2), test_amount_2);
}

#[test]
fn test_add_multiples_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let test_amount_3 = 131;
    let env = env_with_mock_auths();
    let [steward, recipient_1, recipient_2, token_1, token_2, token_3] =
        RandomAddresses::new(env.clone()).generate::<6>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.add_aid(&recipient_1, &token_1, &test_amount_1);
    shelter.add_aid(&recipient_2, &token_2, &test_amount_2);
    shelter.add_aid(&recipient_1, &token_3, &test_amount_3);

    assert_eq!(shelter.aid_of(&recipient_1, &token_2), 0);
    assert_eq!(shelter.aid_of(&recipient_2, &token_1), 0);
    assert_eq!(shelter.aid_of(&recipient_2, &token_3), 0);
    assert_eq!(shelter.aid_of(&recipient_1, &token_3), test_amount_3);
    assert_eq!(shelter.aid_of(&recipient_2, &token_2), test_amount_2);
    assert_eq!(shelter.aid_of(&recipient_1, &token_1), test_amount_1);
}

#[test]
fn test_add_multiples_aid_same_recipient() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient, token_1, token_2] = RandomAddresses::new(env.clone()).generate::<4>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.add_aid(&recipient, &token_1, &test_amount_1);
    shelter.add_aid(&recipient, &token_1, &test_amount_2);
    shelter.add_aid(&recipient, &token_2, &test_amount_2);

    assert_eq!(shelter.aid_of(&recipient, &token_2), test_amount_2);
    assert_eq!(
        shelter.aid_of(&recipient, &token_1),
        test_amount_1 + test_amount_2
    );
}

#[test]
fn test_total_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient_1, recipient_2, token_1, token_2] =
        RandomAddresses::new(env.clone()).generate::<5>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));

    shelter.add_aid(&recipient_1, &token_1, &test_amount_1);
    shelter.add_aid(&recipient_2, &token_1, &test_amount_2);
    shelter.add_aid(&recipient_1, &token_2, &test_amount_2);

    assert_eq!(
        shelter.assigned_aid_of(&token_1),
        test_amount_1 + test_amount_2
    );
    assert_eq!(shelter.assigned_aid_of(&token_2), test_amount_2);
}

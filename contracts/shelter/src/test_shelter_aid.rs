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
fn test_add_aid_unauthorized() {
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
            fn_name: "add_aid",
            args: (&recipient, &token.address(), test_amount).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    shelter.add_aid(&recipient, &token.address(), &test_amount);
}

#[test]
#[should_panic(expected = "Not enough balance")]
fn test_add_aid_when_not_enough_balance() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let [steward, recipient] = RandomAddresses::new(env.clone()).generate::<2>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token = TestToken::new(&env);

    shelter.add_aid(&recipient, &token.address(), &test_amount);
}

#[test]
fn test_add_aid() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let add_aid_symbol = Symbol::new(&env, "add_aid");
    let [steward, recipient, not_recipient] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token = TestToken::new(&env);
    token.mint(&shelter.address, &test_amount);

    shelter.add_aid(&recipient, &token.address(), &test_amount);

    assert_auth_fn(
        &env,
        steward.clone(),
        (
            shelter.address.clone(),
            add_aid_symbol.clone(),
            (&recipient, &token.address(), &test_amount).into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                shelter.address.clone(),
                (add_aid_symbol, recipient.clone(), token.address(),).into_val(&env),
                test_amount.into_val(&env)
            ),
        ]
    );
    assert_instance_ttl_extension(&env, &shelter.address);
    assert_eq!(shelter.aid_of(&not_recipient, &token.address()), 0);
    assert_eq!(shelter.aid_of(&recipient, &token.address()), test_amount);
}

#[test]
fn test_add_multiple_tokens_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient] = RandomAddresses::new(env.clone()).generate::<2>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    token_1.mint(&shelter.address, &test_amount_1);
    token_2.mint(&shelter.address, &test_amount_2);
    token_3.mint(&shelter.address, &test_amount_2);

    shelter.add_aid(&recipient, &token_1.address(), &test_amount_1);
    shelter.add_aid(&recipient, &token_2.address(), &test_amount_2);

    assert_eq!(shelter.aid_of(&recipient, &token_3.address()), 0);
    assert_eq!(
        shelter.aid_of(&recipient, &token_1.address()),
        test_amount_1
    );
    assert_eq!(
        shelter.aid_of(&recipient, &token_2.address()),
        test_amount_2
    );
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
}

#[test]
fn test_add_multiples_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let test_amount_3 = 131;
    let env = env_with_mock_auths();
    let [steward, recipient_1, recipient_2] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    token_1.mint(&shelter.address, &test_amount_1);
    token_2.mint(&shelter.address, &test_amount_2);
    token_3.mint(&shelter.address, &test_amount_3);

    shelter.add_aid(&recipient_1, &token_1.address(), &test_amount_1);
    shelter.add_aid(&recipient_2, &token_2.address(), &test_amount_2);
    shelter.add_aid(&recipient_1, &token_3.address(), &test_amount_3);

    assert_eq!(shelter.aid_of(&recipient_1, &token_2.address()), 0);
    assert_eq!(shelter.aid_of(&recipient_2, &token_1.address()), 0);
    assert_eq!(shelter.aid_of(&recipient_2, &token_3.address()), 0);
    assert_eq!(
        shelter.aid_of(&recipient_1, &token_3.address()),
        test_amount_3
    );
    assert_eq!(
        shelter.aid_of(&recipient_2, &token_2.address()),
        test_amount_2
    );
    assert_eq!(
        shelter.aid_of(&recipient_1, &token_1.address()),
        test_amount_1
    );
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
    assert_assigned_aid(&shelter, &token_3);
}

#[test]
fn test_add_multiples_aid_same_recipient() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient] = RandomAddresses::new(env.clone()).generate::<2>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    token_1.mint(&shelter.address, &(test_amount_1 + test_amount_2));
    token_2.mint(&shelter.address, &test_amount_2);

    shelter.add_aid(&recipient, &token_1.address(), &test_amount_1);
    shelter.add_aid(&recipient, &token_1.address(), &test_amount_2);
    shelter.add_aid(&recipient, &token_2.address(), &test_amount_2);

    assert_eq!(
        shelter.aid_of(&recipient, &token_2.address()),
        test_amount_2
    );
    assert_eq!(
        shelter.aid_of(&recipient, &token_1.address()),
        test_amount_1 + test_amount_2
    );
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
}

#[test]
fn test_total_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward, recipient_1, recipient_2] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    token_1.mint(
        &shelter.address,
        &(test_amount_1 + test_amount_2 + test_amount_1),
    );
    token_2.mint(&shelter.address, &test_amount_2);

    shelter.add_aid(&recipient_1, &token_1.address(), &test_amount_1);
    shelter.add_aid(&recipient_2, &token_1.address(), &test_amount_2);
    shelter.add_aid(&recipient_1, &token_2.address(), &test_amount_2);
    shelter.add_aid(&recipient_1, &token_1.address(), &test_amount_1);

    assert_eq!(
        shelter.assigned_aid_of(&token_1.address()),
        test_amount_1 + test_amount_2 + test_amount_1
    );
    assert_eq!(shelter.assigned_aid_of(&token_2.address()), test_amount_2);
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
}

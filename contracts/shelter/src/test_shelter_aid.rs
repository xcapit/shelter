#![cfg(test)]
extern crate std;

use soroban_sdk::{
    testutils::{Events, MockAuth, MockAuthInvoke},
    vec, IntoVal, Symbol,
};

use crate::{
    testtools::{
        assert_assigned_aid, assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths,
        shelter_id, RandomAddresses, RandomKeypair, TestBucket, TestToken,
    },
    ShelterClient,
};

#[test]
#[should_panic(expected = "Unauthorized function call for address")]
fn test_bound_aid_unauthorized() {
    let env = env_with_mock_auths();
    let [attacker] = RandomAddresses::new(env.clone()).generate::<1>();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);
    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &MockAuthInvoke {
            contract: &tb.shelter.address,
            fn_name: "bound_aid",
            args: (&tb.recipient.public_key(), &tb.token.address(), tb.amount).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);
}

#[test]
#[should_panic(expected = "Not enough balance")]
fn test_bound_aid_when_not_enough_balance() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());

    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);
}

#[test]
fn test_bound_aid() {
    let env = env_with_mock_auths();
    let bound_aid_symbol = Symbol::new(&env, "bound_aid");
    let tb = TestBucket::default(env.clone());
    let not_recipient = RandomKeypair::new(env.clone());
    tb.token.mint(&tb.shelter.address, &tb.amount);

    tb.shelter
        .bound_aid(&tb.recipient.public_key(), &tb.token.address(), &tb.amount);

    assert_auth_fn(
        &env,
        tb.steward.clone(),
        (
            tb.shelter.address.clone(),
            bound_aid_symbol.clone(),
            (&tb.recipient.public_key(), &tb.token.address(), &tb.amount).into_val(&env),
        ),
    );
    assert_eq!(
        env.events().all(),
        vec![
            &env,
            (
                tb.shelter.address.clone(),
                (
                    bound_aid_symbol,
                    tb.recipient.public_key(),
                    tb.token.address(),
                )
                    .into_val(&env),
                tb.amount.into_val(&env)
            ),
        ]
    );
    assert_instance_ttl_extension(&env, &tb.shelter.address);
    assert_eq!(
        tb.shelter
            .aid_of(&not_recipient.public_key(), &tb.token.address()),
        0
    );
    assert_eq!(
        tb.shelter
            .aid_of(&tb.recipient.public_key(), &tb.token.address()),
        tb.amount
    );
}

#[test]
fn test_bound_multiple_tokens_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient = RandomKeypair::new(env.clone());
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    token_1.mint(&shelter.address, &test_amount_1);
    token_2.mint(&shelter.address, &test_amount_2);
    token_3.mint(&shelter.address, &test_amount_2);

    shelter.bound_aid(&recipient.public_key(), &token_1.address(), &test_amount_1);
    shelter.bound_aid(&recipient.public_key(), &token_2.address(), &test_amount_2);

    assert_eq!(
        shelter.aid_of(&recipient.public_key(), &token_3.address()),
        0
    );
    assert_eq!(
        shelter.aid_of(&recipient.public_key(), &token_1.address()),
        test_amount_1
    );
    assert_eq!(
        shelter.aid_of(&recipient.public_key(), &token_2.address()),
        test_amount_2
    );
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
}

#[test]
fn test_bound_multiples_aid() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let test_amount_3 = 131;
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient_1 = RandomKeypair::new(env.clone());
    let recipient_2 = RandomKeypair::new(env.clone());
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    let token_3 = TestToken::new(&env);
    token_1.mint(&shelter.address, &test_amount_1);
    token_2.mint(&shelter.address, &test_amount_2);
    token_3.mint(&shelter.address, &test_amount_3);

    shelter.bound_aid(
        &recipient_1.public_key(),
        &token_1.address(),
        &test_amount_1,
    );
    shelter.bound_aid(
        &recipient_2.public_key(),
        &token_2.address(),
        &test_amount_2,
    );
    shelter.bound_aid(
        &recipient_1.public_key(),
        &token_3.address(),
        &test_amount_3,
    );

    assert_eq!(
        shelter.aid_of(&recipient_1.public_key(), &token_2.address()),
        0
    );
    assert_eq!(
        shelter.aid_of(&recipient_2.public_key(), &token_1.address()),
        0
    );
    assert_eq!(
        shelter.aid_of(&recipient_2.public_key(), &token_3.address()),
        0
    );
    assert_eq!(
        shelter.aid_of(&recipient_1.public_key(), &token_3.address()),
        test_amount_3
    );
    assert_eq!(
        shelter.aid_of(&recipient_2.public_key(), &token_2.address()),
        test_amount_2
    );
    assert_eq!(
        shelter.aid_of(&recipient_1.public_key(), &token_1.address()),
        test_amount_1
    );
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
    assert_assigned_aid(&shelter, &token_3);
}

#[test]
fn test_bound_multiples_aid_same_recipient() {
    let test_amount_1 = 100;
    let test_amount_2 = 130;
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient = RandomKeypair::new(env.clone());
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    token_1.mint(&shelter.address, &(test_amount_1 + test_amount_2));
    token_2.mint(&shelter.address, &test_amount_2);

    shelter.bound_aid(&recipient.public_key(), &token_1.address(), &test_amount_1);
    shelter.bound_aid(&recipient.public_key(), &token_1.address(), &test_amount_2);
    shelter.bound_aid(&recipient.public_key(), &token_2.address(), &test_amount_2);

    assert_eq!(
        shelter.aid_of(&recipient.public_key(), &token_2.address()),
        test_amount_2
    );
    assert_eq!(
        shelter.aid_of(&recipient.public_key(), &token_1.address()),
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
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient_1 = RandomKeypair::new(env.clone());
    let recipient_2 = RandomKeypair::new(env.clone());
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    token_1.mint(
        &shelter.address,
        &(test_amount_1 + test_amount_2 + test_amount_1),
    );
    token_2.mint(&shelter.address, &test_amount_2);

    shelter.bound_aid(
        &recipient_1.public_key(),
        &token_1.address(),
        &test_amount_1,
    );
    shelter.bound_aid(
        &recipient_2.public_key(),
        &token_1.address(),
        &test_amount_2,
    );
    shelter.bound_aid(
        &recipient_1.public_key(),
        &token_2.address(),
        &test_amount_2,
    );
    shelter.bound_aid(
        &recipient_1.public_key(),
        &token_1.address(),
        &test_amount_1,
    );

    assert_eq!(
        shelter.assigned_aid_of(&token_1.address()),
        test_amount_1 + test_amount_2 + test_amount_1
    );
    assert_eq!(shelter.assigned_aid_of(&token_2.address()), test_amount_2);
    assert_assigned_aid(&shelter, &token_1);
    assert_assigned_aid(&shelter, &token_2);
}

#[test]
fn test_available_aid() {
    let test_amount = 100;
    let test_half_amount = test_amount / 2;
    let env = env_with_mock_auths();
    let [steward] = RandomAddresses::new(env.clone()).generate::<1>();
    let recipient = RandomKeypair::new(env.clone());
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token_1 = TestToken::new(&env);
    let token_2 = TestToken::new(&env);
    token_1.mint(&shelter.address, &(test_amount * 3));
    token_2.mint(&shelter.address, &test_amount);

    shelter.bound_aid(&recipient.public_key(), &token_1.address(), &test_amount);
    shelter.bound_aid(
        &recipient.public_key(),
        &token_2.address(),
        &test_half_amount,
    );

    assert_eq!(shelter.assigned_aid_of(&token_1.address()), test_amount);
    assert_eq!(
        shelter.assigned_aid_of(&token_2.address()),
        test_half_amount
    );
    assert_eq!(
        shelter.available_aid_of(&token_1.address()),
        (test_amount * 3) - test_amount
    );
    assert_eq!(
        shelter.available_aid_of(&token_2.address()),
        test_half_amount
    );
}

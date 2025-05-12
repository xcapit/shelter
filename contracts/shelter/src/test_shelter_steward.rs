#![cfg(test)]
extern crate std;

use ed25519_dalek::ed25519::signature::SignerMut;
use soroban_sdk::{
    auth::{Context, ContractContext},
    testutils::{Address as _, Events, MockAuth, MockAuthInvoke},
    vec, Address, Env, IntoVal, Symbol,
};

use crate::{
    pass::Pass,
    storage_types::Error,
    testtools::{
        assert_auth_fn, assert_instance_ttl_extension, env_with_mock_auths, shelter_id,
        RandomAddresses, TestBucket,
    },
    ShelterClient,
};

fn _try_check_auth(
    tb: &TestBucket,
    amount: i128,
    env: &Env,
) -> Result<(), Result<Error, soroban_sdk::InvokeError>> {
    env.try_invoke_contract_check_auth::<Error>(
        &tb.shelter.address,
        &tb.payload,
        Pass {
            public_key: tb.steward_key.clone(),
            signature: tb
                .steward_signing_key
                .clone()
                .sign(tb.payload.to_array().as_slice())
                .to_bytes()
                .into_val(env),
        }
        .into_val(env),
        &vec![
            env,
            Context::Contract(ContractContext {
                contract: tb.token.address().clone(),
                fn_name: Symbol::new(env, "transfer"),
                args: (&tb.shelter.address, Address::generate(env), amount).into_val(env),
            }),
        ],
    )
}

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

#[test]
fn test_init_shelter_steward() {
    let env = env_with_mock_auths();
    let init_symbol = Symbol::new(&env, "init");
    let tb = TestBucket::default(env.clone());

    tb.shelter.init(&tb.steward_key);

    assert_auth_fn(
        &env,
        tb.steward.clone(),
        (
            tb.shelter.address.clone(),
            init_symbol.clone(),
            (&tb.steward_key,).into_val(&env),
        ),
    );
    assert_eq!(&tb.steward_key, &tb.shelter.steward_key());
    assert_instance_ttl_extension(&env, &tb.shelter.address);
}

#[test]
fn test_transfer_available_aid() {
    let env = env_with_mock_auths();
    let tb = TestBucket::default(env.clone());
    tb.token.mint(&tb.shelter.address, &(tb.amount * 2));
    tb.shelter.init(&tb.steward_key);
    tb.shelter.bound_aid(
        &tb.recipient.public_key(),
        &tb.token.address(),
        &tb.amount,
        &tb.expiration,
    );
    tb.shelter.bound_aid(
        &tb.steward_key,
        &tb.token.address(),
        &tb.shelter.available_aid_of(&tb.token.address()),
        &tb.expiration,
    );

    _try_check_auth(&tb, tb.amount, &env).unwrap();

    assert_eq!(tb.shelter.assigned_aid_of(&tb.token.address()), 100);
}

#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env};

use crate::{shelter::Shelter, ShelterClient};

#[test]
fn test_steward_set_on_deployment() {
    let env = Env::default();
    let steward = Address::generate(&env);
    let shelter_id = env.register(Shelter, (&steward,));

    let shelter = ShelterClient::new(&env, &shelter_id);

    assert_eq!(shelter.steward(), steward)
}

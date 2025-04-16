#![cfg(test)]

use crate::{
    testtools::{env_with_mock_auths, shelter_id, RandomAddresses, TestToken},
    ShelterClient,
};

#[test]
fn test_transfer_bound_aid() {
    let test_amount = 100;
    let env = env_with_mock_auths();
    let [steward, recipient, not_recipient] = RandomAddresses::new(env.clone()).generate::<3>();
    let shelter = ShelterClient::new(&env, &shelter_id(&env, &steward));
    let token = TestToken::new(&env);
    token.mint(&shelter.address, &test_amount);

    shelter.bound_aid(&recipient, &token.address(), &test_amount);

    token.transfer(&shelter.address, &not_recipient, &test_amount);

    assert_eq!(token.balance(&shelter.address), 0);

    // TODO: could be 100 after spend aid in __check_auth...
    assert_eq!(shelter.available_aid_of(&token.address()), -100);
}

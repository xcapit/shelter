use soroban_sdk::{panic_with_error, token::TokenClient, Address, Env};

use crate::{assigned_aid::AssignedAid, storage_types::Error};

pub struct AvailableAid<'a> {
    token: TokenClient<'a>,
}
impl AvailableAid<'_> {
    pub fn from(env: &Env, token: &Address) -> Self {
        AvailableAid {
            token: TokenClient::new(env, token),
        }
    }

    pub fn expect_enough_balance(&self, amount_to_cover: i128) {
        if amount_to_cover > self._balance() {
            panic_with_error!(self.token.env, Error::NotEnoughBalance);
        }
    }

    pub fn amount(&self) -> i128 {
        self._balance() - AssignedAid::from(&self.token.env, self.token.address.clone()).amount()
    }

    fn _balance(&self) -> i128 {
        self.token
            .balance(&self.token.env.current_contract_address())
    }
}

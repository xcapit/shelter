use soroban_sdk::{token::TokenClient, Address, Env};

pub struct AvailableAid<'a> {
    token: TokenClient<'a>,
}
impl AvailableAid<'_> {
    pub fn from(env: &Env, token: &Address) -> Self {
        AvailableAid {
            token: TokenClient::new(env, token),
        }
    }

    pub fn validate(&self, amount_to_cover: i128) {
        if amount_to_cover
            > self
                .token
                .balance(&self.token.env.current_contract_address())
        {
            panic!("Not enough balance");
        }
    }
}

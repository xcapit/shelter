use soroban_sdk::Address;

pub struct Aid {
    recipient: Address,
    token: Address,
    amount: i128,
}

impl Aid {
    pub fn new(recipient: Address, token: Address, amount: i128) -> Self {
        Aid {
            recipient,
            token,
            amount,
        }
    }

    pub fn save_on(env: &Env) {}
}

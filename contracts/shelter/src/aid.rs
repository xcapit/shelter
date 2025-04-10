use soroban_sdk::Address;

pub struct Aid {
    recipient: Address,
    token: Address,
    amount: i128,
}

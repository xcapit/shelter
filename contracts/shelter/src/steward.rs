use crate::storage_types::DataKey;
use soroban_sdk::{Address, Env};

pub struct Steward {
    address: Address,
}

impl Steward {
    pub fn new(address: Address) -> Self {
        Steward { address }
    }

    pub fn from(env: &Env) -> Self {
        Steward {
            address: env
                .storage()
                .instance()
                .get::<_, Address>(&DataKey::Steward)
                .unwrap(),
        }
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .instance()
            .set(&DataKey::Steward, &self.address);
    }

    pub fn address(&self) -> Address {
        self.address.clone()
    }
}

use soroban_sdk::{BytesN, Env};

use crate::storage_types::DataKey;

pub struct StewardKey {
    value: BytesN<32>,
}

impl StewardKey {
    pub fn new(key: BytesN<32>) -> Self {
        StewardKey { value: key }
    }

    pub fn from(env: &Env) -> Self {
        StewardKey {
            value: env.storage().instance().get(&DataKey::StewardKey).unwrap(),
        }
    }

    pub fn value(&self) -> BytesN<32> {
        self.value.clone()
    }

    pub fn equals(&self, key: BytesN<32>) -> bool {
        self.value == key
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .instance()
            .set(&DataKey::StewardKey, &self.value);
    }
}

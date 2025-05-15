use soroban_sdk::{BytesN, Env};

use crate::storage_types::DataKey;

pub struct ReleaseKey {
    value: BytesN<32>,
}

impl ReleaseKey {
    pub fn new(key: BytesN<32>) -> Self {
        ReleaseKey { value: key }
    }

    pub fn from(env: &Env) -> Self {
        ReleaseKey {
            value: env.storage().instance().get(&DataKey::ReleaseKey).unwrap(),
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
            .set(&DataKey::ReleaseKey, &self.value);
    }
}

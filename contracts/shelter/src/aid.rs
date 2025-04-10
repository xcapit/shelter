use soroban_sdk::{Address, Env};

use crate::storage_types::{AidDataKey, AidValue, DataKey};

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

    pub fn save_on(&self, env: &Env) {
        env.storage().persistent().set(
            &DataKey::Aid(AidDataKey { self.recipient, self.token }),
            &AidValue {
                amount,
                expiration: 0,
            },
        );
    }

    fn _aid_key(&self) -> DataKey {
        DataKey::Aid(AidDataKey { recipient: self.recipient, token: self.token })
    }
}

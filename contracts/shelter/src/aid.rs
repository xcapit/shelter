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

    pub fn from(env: &Env, recipient: Address, token: Address) -> Self {
        Aid {
            recipient: recipient.clone(),
            token: token.clone(),
            amount: env
                .storage()
                .persistent()
                .get::<_, AidValue>(&DataKey::Aid(AidDataKey { recipient, token }))
                .unwrap_or(0_i128)
                .amount,
        }
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .persistent()
            .set(&self._aid_key(), &self._aid_value());
    }

    pub fn amount(&self) -> i128 {
        self.amount
    }

    fn _aid_value(&self) -> AidValue {
        AidValue {
            amount: self.amount,
            expiration: 0,
        }
    }

    fn _aid_key(&self) -> DataKey {
        DataKey::Aid(AidDataKey {
            recipient: self.recipient.clone(),
            token: self.token.clone(),
        })
    }
}

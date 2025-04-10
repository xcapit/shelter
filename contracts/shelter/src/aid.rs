use soroban_sdk::{token, Address, Env};

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
            recipient,
            token,
            amount: env
                .storage()
                .persistent()
                .get::<_, AidValue>(&DataKey::Aid(AidDataKey { recipient, token }))
                .unwrap()
                .amount,
        }
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .persistent()
            .set(&self._aid_key(), &self._aid_value());
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

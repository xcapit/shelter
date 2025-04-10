use soroban_sdk::{Address, Env, Symbol};

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
                .unwrap_or(AidValue {
                    amount: 0,
                    expiration: 0,
                })
                .amount,
        }
    }

    pub fn add(&self, amount: i128) -> Self {
        Self::new(
            self.recipient.clone(),
            self.token.clone(),
            self.amount + amount,
        )
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .persistent()
            .set(&self._aid_key(), &self._aid_value());
        env.events().publish(
            (
                Symbol::new(env, "add_aid"),
                self.recipient.clone(),
                self.token.clone(),
            ),
            self.amount,
        );
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

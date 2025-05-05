use soroban_sdk::{Address, BytesN, Env, Symbol};

use crate::{
    assigned_aid::AssignedAid,
    storage_types::{AidDataKey, AidValue, DataKey, Error},
};

pub struct Aid {
    recipient: BytesN<32>,
    token: Address,
    amount: i128,
    new_amount: i128,
}

impl Aid {
    pub fn from(env: &Env, recipient: BytesN<32>, token: Address) -> Self {
        Aid {
            recipient: recipient.clone(),
            token: token.clone(),
            amount: env
                .storage()
                .persistent()
                .get::<_, AidValue>(&Aid::_aid_key_of(recipient, token))
                .unwrap_or(AidValue {
                    amount: 0,
                    expiration: 0,
                })
                .amount,
            new_amount: 0,
        }
    }

    pub fn add(&self, amount: i128) -> Self {
        Aid {
            recipient: self.recipient.clone(),
            token: self.token.clone(),
            amount: self.amount,
            new_amount: amount,
        }
    }

    pub fn expect_save_on(&self, env: &Env) {
        self._expect_save_assigned_aid(env);
        self._save_aid(env);
        self._publish_event(env);
    }

    pub fn enough_for(&self, transfer_amount: i128) -> Result<(), Error> {
        match transfer_amount <= self.amount() {
            true => Ok(()),
            false => Err(Error::NotEnoughAid),
        }
    }

    pub fn amount(&self) -> i128 {
        self.amount + self.new_amount
    }

    fn _publish_event(&self, env: &Env) {
        env.events().publish(
            (
                Symbol::new(env, "bound_aid"),
                self.recipient.clone(),
                self.token.clone(),
            ),
            self.new_amount,
        );
    }

    fn _save_aid(&self, env: &Env) {
        env.storage()
            .persistent()
            .set(&self._aid_key(), &self._aid_value());
    }

    fn _expect_save_assigned_aid(&self, env: &Env) {
        AssignedAid::from(env, self.token.clone())
            .add(self.new_amount)
            .expect_save_on(env);
    }

    fn _aid_value(&self) -> AidValue {
        AidValue {
            amount: self.amount(),
            expiration: 0,
        }
    }

    fn _aid_key(&self) -> DataKey {
        Aid::_aid_key_of(self.recipient.clone(), self.token.clone())
    }

    fn _aid_key_of(recipient: BytesN<32>, token: Address) -> DataKey {
        DataKey::Aid(AidDataKey { recipient, token })
    }
}

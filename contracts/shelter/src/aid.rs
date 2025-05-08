use soroban_sdk::{panic_with_error, Address, BytesN, Env, Symbol};

use crate::{
    assigned_aid::AssignedAid,
    storage_types::{AidDataKey, AidValue, DataKey, Error},
};

pub struct Aid {
    recipient: BytesN<32>,
    token: Address,
    amount: i128,
    new_amount: i128,
    expiration: u64,
}

impl Aid {
    pub fn from(env: &Env, recipient: BytesN<32>, token: Address) -> Self {
        let aid_value = env
            .storage()
            .persistent()
            .get::<_, AidValue>(&Aid::_aid_key_of(recipient.clone(), token.clone()))
            .unwrap_or(AidValue {
                amount: 0,
                expiration: 0,
            });
        Aid {
            recipient,
            token,
            amount: aid_value.amount,
            new_amount: 0,
            expiration: aid_value.expiration,
        }
    }

    pub fn bound(&self, amount: i128, expiration: u64) -> Self {
        Aid {
            recipient: self.recipient.clone(),
            token: self.token.clone(),
            amount: self.amount,
            new_amount: amount,
            expiration,
        }
    }

    pub fn unbound(&self) -> Self {
        self.bound(-self.expect_amount(), 0u64)
    }

    pub fn expect_save_on(&self, env: &Env) {
        self._expect_save_assigned_aid(env);
        self._save(env);
    }

    pub fn expect_update_on(&self, env: &Env) {
        self._update_assigned_aid(env);
        self._save(env);
    }

    pub fn expect_amount(&self) -> i128 {
        let amount = self.amount + self.new_amount;
        match amount < 0 {
            true => panic_with_error!(self.token.env(), Error::NotEnoughAid),
            false => amount,
        }
    }

    pub fn expiration(&self) -> u64 {
        self.expiration
    }

    pub fn validate_expiration(&self, current_timestamp: u64) -> Result<(), Error> {
        match current_timestamp > self.expiration() {
            true => Err(Error::ExpiredAid),
            false => Ok(()),
        }
    }

    pub fn value(&self) -> AidValue {
        AidValue {
            amount: self.expect_amount(),
            expiration: self.expiration(),
        }
    }

    fn _save(&self, env: &Env) {
        self._save_aid(env);
        match self.expect_amount() {
            0 => self._publish_event(env, Symbol::new(env, "unbound_aid"), 0),
            _ => self._publish_event(env, Symbol::new(env, "bound_aid"), self.new_amount),
        }
    }

    fn _publish_event(&self, env: &Env, event_name: Symbol, amount: i128) {
        env.events().publish(
            (event_name, self.recipient.clone(), self.token.clone()),
            amount,
        );
    }

    fn _save_aid(&self, env: &Env) {
        env.storage()
            .persistent()
            .set(&self._aid_key(), &self.value());
    }

    fn _update_assigned_aid(&self, env: &Env) {
        AssignedAid::from(env, self.token.clone())
            .add(self.new_amount)
            .update_on(env);
    }

    fn _expect_save_assigned_aid(&self, env: &Env) {
        AssignedAid::from(env, self.token.clone())
            .add(self.new_amount)
            .expect_save_on(env);
    }

    fn _aid_key(&self) -> DataKey {
        Aid::_aid_key_of(self.recipient.clone(), self.token.clone())
    }

    fn _aid_key_of(recipient: BytesN<32>, token: Address) -> DataKey {
        DataKey::Aid(AidDataKey { recipient, token })
    }
}

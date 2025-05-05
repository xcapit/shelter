use soroban_sdk::{Address, Env};

use crate::{available_aid::AvailableAid, storage_types::DataKey};

pub struct AssignedAid {
    token: Address,
    amount: i128,
}
impl AssignedAid {
    pub fn from(env: &Env, token: Address) -> Self {
        AssignedAid {
            token: token.clone(),
            amount: env
                .storage()
                .instance()
                .get::<_, i128>(&AssignedAid::_assigned_aid_key_of(token))
                .unwrap_or_default(),
        }
    }

    pub fn add(self, amount: i128) -> Self {
        AssignedAid {
            token: self.token,
            amount: self.amount + amount,
        }
    }

    pub fn expect_save_on(&self, env: &Env) {
        AvailableAid::from(env, &self.token).expect_enough_balance(self.amount());
        env.storage()
            .instance()
            .set(&self._assigned_aid_key(), &self.amount);
    }

    pub fn amount(&self) -> i128 {
        self.amount
    }

    fn _assigned_aid_key(&self) -> DataKey {
        AssignedAid::_assigned_aid_key_of(self.token.clone())
    }

    fn _assigned_aid_key_of(token: Address) -> DataKey {
        DataKey::AssignedAid(token)
    }
}

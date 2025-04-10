use soroban_sdk::{Address, Env, Symbol};

use crate::storage_types::DataKey;

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
                .get::<_, i128>(&DataKey::AssignedAid(token))
                .unwrap_or_default(),
        }
    }

    pub fn add(self, amount: i128) -> Self {
        AssignedAid {
            token: self.token,
            amount: self.amount + amount,
        }
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .instance()
            .set(&DataKey::AssignedAid(self.token.clone()), &self.amount);
    }

    pub fn amount(&self) -> i128 {
        self.amount
    }
}

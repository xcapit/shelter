use crate::storage_types::DataKey;
use soroban_sdk::{Address, Env, Symbol};

pub struct Steward {
    address: Address,
}

impl Steward {
    pub fn new(address: Address) -> Self {
        Steward { address }
    }

    pub fn from(env: &Env) -> Self {
        Steward {
            address: env
                .storage()
                .instance()
                .get::<_, Address>(&DataKey::Steward)
                .unwrap(),
        }
    }

    pub fn save_on(&self, env: &Env) {
        self._save(env, &self.address);
    }

    pub fn update_on(&mut self, env: &Env, new_address: &Address) {
        self._save(env, new_address);
        env.events().publish(
            (Symbol::new(env, "update_steward"), self.address()),
            new_address.clone(),
        );

        self.address = new_address.clone();
    }

    pub fn address(&self) -> Address {
        self.address.clone()
    }

    fn _save(&self, env: &Env, address: &Address) {
        self.address.require_auth();
        env.storage().instance().set(&DataKey::Steward, &address);
    }
}

use soroban_sdk::{contracttype, panic_with_error, Env};

use crate::storage_types::{DataKey, Error};

#[derive(Clone)]
#[contracttype]
pub enum Gate {
    Open,
    Guarded,
}

impl Gate {
    pub fn from(env: &Env) -> Self {
        env.storage().instance().get(&DataKey::GateState).unwrap()
    }

    pub fn open() -> Self {
        Gate::Open
    }

    pub fn guard() -> Self {
        Gate::Guarded
    }

    pub fn expect_perform<F, R>(&self, env: &Env, action: F) -> R
    where
        F: FnOnce() -> R,
    {
        match self {
            Gate::Open => action(),
            Gate::Guarded => panic_with_error!(env, Error::ShelterGuarded),
        }
    }

    pub fn save_on(&self, env: &Env) {
        env.storage()
            .instance()
            .set(&DataKey::GateState, &self.clone());
    }
}

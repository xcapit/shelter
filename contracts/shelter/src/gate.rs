use soroban_sdk::{contracttype, panic_with_error, Env, Symbol};

use crate::storage_types::{DataKey, Error};

#[derive(Clone)]
#[contracttype]
pub enum Gate {
    Open,
    Guarded,
    Sealed,
}

impl Gate {
    pub fn from(env: &Env) -> Self {
        env.storage()
            .instance()
            .get(&DataKey::GateState)
            .unwrap_or(Gate::Open)
    }

    pub fn open(&self, env: &Env) {
        self._to(env, Gate::Open);
    }

    pub fn guard(&self, env: &Env) {
        self._to(env, Gate::Guarded);
    }

    pub fn seal(&self, env: &Env) {
        self._to(env, Gate::Sealed);
    }

    pub fn expect_perform<F, R>(&self, env: &Env, action: F) -> R
    where
        F: FnOnce() -> R,
    {
        match self {
            Gate::Open => action(),
            Gate::Sealed => panic_with_error!(env, Error::ShelterSealed),
            Gate::Guarded => panic_with_error!(env, Error::ShelterGuarded),
        }
    }

    fn _to(&self, env: &Env, state: Gate) {
        match self {
            Gate::Sealed => panic_with_error!(env, Error::ShelterSealed),
            _ => {
                env.storage().instance().set(&DataKey::GateState, &state);
                env.events()
                    .publish((Symbol::new(&env, "gate_changed"),), state);
            }
        }
    }
}

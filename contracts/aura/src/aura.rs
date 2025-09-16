use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

pub(crate) const DAY_IN_LEDGERS: u32 = 17280;
pub(crate) const INSTANCE_BUMP_AMOUNT: u32 = 14 * DAY_IN_LEDGERS;
pub(crate) const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT / 2;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Owner,
    Point(Address),
}

#[contract]
pub struct Aura;

#[contractimpl]
impl Aura {
    pub fn __constructor(env: Env, owner: Address) {
        env.storage().instance().set(&DataKey::Owner, &owner);
    }

    pub fn mint(env: Env, amount: i128, to: Address) {
        // TODO: minter role (multiple)
        // env.storage()
        //     .instance()
        //     .get::<_, Address>(&DataKey::Owner)
        //     .unwrap()
        //     .require_auth();
        env.storage().persistent().set(&DataKey::Point(to), &amount);
        Aura::_extend_instance_ttl(&env);
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Point(account))
            .unwrap_or_default()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

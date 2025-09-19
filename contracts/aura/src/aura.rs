use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, Address, Env,
};

pub(crate) const DAY_IN_LEDGERS: u32 = 17280;
pub(crate) const INSTANCE_BUMP_AMOUNT: u32 = 14 * DAY_IN_LEDGERS;
pub(crate) const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT / 2;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Owner,
    Points(Address),
    Minter(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotAMinter = 1,
}

#[contract]
pub struct Aura;

#[contractimpl]
impl Aura {
    pub fn __constructor(env: Env, owner: Address) {
        env.storage().instance().set(&DataKey::Owner, &owner);
    }

    pub fn add_minter(env: Env, minter: Address) {
        Aura::_owner(&env).require_auth();
        env.storage()
            .persistent()
            .set(&DataKey::Minter(minter.clone()), &minter);
    }

    pub fn is_minter(env: Env, account: Address) -> bool {
        env.storage()
            .persistent()
            .get::<_, Address>(&DataKey::Minter(account))
            .is_some()
    }

    pub fn mint(env: Env, amount: i128, to: Address) {
        env.storage().persistent().set(
            &DataKey::Points(to.clone()),
            &(Aura::balance(env.clone(), to).checked_add(amount).unwrap()),
        );
        Aura::_extend_instance_ttl(&env);
        //         // TODO:
        // pub fn mint(env: Env, minter: Address, amount: i128, to: Address) {
        // match Aura::is_minter(env.clone(), minter) {
        //     true => {
        //         // to.require_auth();
        //         env.storage().persistent().set(
        //             &DataKey::Points(to.clone()),
        //             &(Aura::balance(env.clone(), to).checked_add(amount).unwrap()),
        //         );
        //         Aura::_extend_instance_ttl(&env);
        //     }
        //     false => panic_with_error!(env, Error::NotAMinter),
        // }
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Points(account))
            .unwrap_or_default()
    }

    fn _owner(env: &Env) -> Address {
        env.storage().instance().get(&DataKey::Owner).unwrap()
    }

    fn _extend_instance_ttl(env: &Env) {
        env.storage()
            .instance()
            .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
    }
}

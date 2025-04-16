use soroban_sdk::{contracterror, contracttype, Address, BytesN};

pub(crate) const DAY_IN_LEDGERS: u32 = 17280;
pub(crate) const INSTANCE_BUMP_AMOUNT: u32 = 7 * DAY_IN_LEDGERS;
pub(crate) const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS;

#[derive(Clone)]
#[contracttype]
pub struct AidDataKey {
    pub recipient: Address,
    pub token: Address,
}

#[contracttype]
pub struct AidValue {
    pub amount: i128,
    pub expiration: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Aid(AidDataKey),
    AssignedAid(Address),
    Steward,
}

#[contracttype]
#[derive(Clone)]
pub struct AccSignature {
    pub public_key: BytesN<32>,
    pub signature: BytesN<64>,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ShelterError {
    AuthError = 1,
    NotEnoughBalance = 2,
}

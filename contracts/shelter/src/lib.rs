#![no_std]

mod aid;
mod assigned_aid;
mod available_aid;
mod gate;
mod pass;
mod shelter;
mod steward;
mod storage_types;
mod test_aid_transfer;
mod test_gate;
mod test_shelter_aid;
mod test_shelter_auth;
mod test_shelter_steward;
mod testtools;
mod transfer;

pub use crate::shelter::ShelterClient;

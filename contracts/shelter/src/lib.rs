#![no_std]

mod aid;
mod assigned_aid;
mod available_aid;
mod shelter;
mod shelter_pass;
mod steward;
mod storage_types;
mod test_shelter_aid;
mod test_shelter_auth;
mod test_shelter_steward;
mod testtools;
mod transfer;

pub use crate::shelter::ShelterClient;

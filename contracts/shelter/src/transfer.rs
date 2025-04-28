use soroban_sdk::{auth::ContractContext, symbol_short, Symbol, TryIntoVal};

use crate::{aid::Aid, storage_types::ShelterError};

pub struct Transfer {
    aid: Aid,
    fn_name: Symbol,
    contract_context: ContractContext,
}

impl Transfer {
    pub fn new(aid: Aid, contract_context: ContractContext) -> Self {
        Self {
            aid,
            contract_context,
            fn_name: symbol_short!("transfer"),
        }
    }

    pub fn validate(&self) -> Result<(), ShelterError> {
        self._validate_action()
            .and_then(|_| self._validate_amount())
    }

    fn _validate_action(&self) -> Result<(), ShelterError> {
        match self.fn_name == self.contract_context.fn_name {
            true => Ok(()),
            false => Err(ShelterError::InvalidAction),
        }
    }

    fn _validate_amount(&self) -> Result<(), ShelterError> {
        match self._amount_to_transfer() <= self.aid.amount() {
            true => Ok(()),
            false => Err(ShelterError::NotEnoughAid),
        }
    }

    fn _amount_to_transfer(&self) -> i128 {
        self.contract_context
            .args
            .get(2)
            .unwrap()
            .try_into_val(self.contract_context.contract.env())
            .unwrap()
    }
}

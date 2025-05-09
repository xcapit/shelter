use soroban_sdk::{auth::ContractContext, symbol_short, Env, Symbol, TryIntoVal};

use crate::{aid::Aid, storage_types::Error};

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

    pub fn validate(&mut self, env: &Env) -> Result<(), Error> {
        let result: Result<(), Error> = self._validate(env);
        match result {
            Ok(_) => {
                self.aid = self
                    .aid
                    .bound(-self._amount_to_transfer(), self.aid.expiration());
                self.aid.expect_update_on(env);
                result
            }
            Err(_) => result,
        }
    }

    fn _validate(&self, env: &Env) -> Result<(), Error> {
        self._validate_action()
            .and_then(|_| self.aid.validate_expiration(env.ledger().timestamp()))
    }

    fn _validate_action(&self) -> Result<(), Error> {
        match self.fn_name == self.contract_context.fn_name {
            true => Ok(()),
            false => Err(Error::InvalidAction),
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

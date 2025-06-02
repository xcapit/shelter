import { Keypair } from '@stellar/stellar-sdk';
import { SigningKeypair } from '../../../shared/account-keypair/account-keypair';

export class FakeStellar {
  constructor(private readonly _submitTransactionReturn: boolean) { }
  submitTransaction() {
    return Promise.resolve(this._submitTransactionReturn);
  }

  transaction() {
    return { sponsoring: () => ({ build: () => ({ sign: () => ({}) }) }) };
  }

  account() {
    return {
      createKeypair: () => SigningKeypair.fromSecret(Keypair.random().secret()),
    };
  }
}

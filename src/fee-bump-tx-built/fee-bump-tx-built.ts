import * as StellarSDK from "@stellar/stellar-sdk";
import { Keypair } from "shelter-sdk";

// TODO: Ta feo el nombre este
export class FeeBumpTxBuilt {
  constructor(private readonly _txBuilder = StellarSDK.TransactionBuilder) {}

  value(signer: Keypair, fee: string, innerTx: any, networkPassphrase: string) {
    return this._txBuilder.buildFeeBumpTransaction(
      signer,
      fee,
      innerTx,
      networkPassphrase
    );
  }
}

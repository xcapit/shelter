import type { FeeBumpTxBuilt } from "../fee-bump-tx-built/fee-bump-tx-built";
import { Keypair, rpc as StellarRpc } from "shelter-sdk";
import * as StellarSDK from "@stellar/stellar-sdk";
import { Rpc } from "../rpc/rpc";

export class SponsoredTransaction {
  constructor(
    private readonly _innerTx: any,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc,
    private readonly _feeBumpTxBuilt: FeeBumpTxBuilt
  ) {}

  async result(): Promise<StellarRpc.Api.GetTransactionResponse | void> {
    const feeBumpTransaction = this._feeBumpTxBuilt.value(
      this._signer,
      (+StellarSDK.BASE_FEE * 2).toString(),
      this._innerTx,
      await this._rpc.network()
    );
    feeBumpTransaction.sign(this._signer);
    return await this._txData(feeBumpTransaction);
  }

  private async _txData(
    tx: StellarSDK.FeeBumpTransaction
  ): Promise<StellarRpc.Api.GetTransactionResponse> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

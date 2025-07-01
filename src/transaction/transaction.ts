import type { Tx } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";
import { rpc } from "@stellar/stellar-sdk";
import type { Rpc } from "../rpc/rpc";
import { TxResult } from "../tx-result/tx-result";

export class Transaction {
  constructor(
    private readonly _rawTx: any,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc,
    private readonly _errorMsg = 'Shelter SDK Transaction Error',
    private readonly _simulate = false
  ) { }

  async result(): Promise<rpc.Api.GetTransactionResponse> {
    const tx = await this._txBuilt();
    tx.sign(this._signer);
    return new TxResult(await this._txData(tx), this._errorMsg).validatedData();
  }

  private async _txBuilt() {
    return this._simulate ?
      await this._simulatedTx(this._rawTx.built!) :
      this._rawTx.built!;
  }

  private async _simulatedTx(tx: any) {
    return this._rpc.assembleTransaction(
      tx,
      await this._rpc.server().simulateTransaction(tx) as unknown as Transaction
    ).build();
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

import type { Tx } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";
import { rpc } from "@stellar/stellar-sdk";
import type { Rpc } from "../rpc/rpc";

export class Transaction {
  constructor(
    private readonly _rawTx: any,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) { }

  async result(): Promise<rpc.Api.GetTransactionResponse> {
    const tx = this._rawTx.built!;
    tx.sign(this._signer);
    return await this._txData(tx);
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

import type { AssembledTransaction, Tx } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";
import type { Rpc } from "../rpc/rpc.interface";

export class Transaction {
  constructor(
    private readonly _rawTx: AssembledTransaction<any>,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) {}

  async result() {
    const tx = this._rawTx.built!;
    tx.sign(this._signer);
    return this._txData(tx);
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

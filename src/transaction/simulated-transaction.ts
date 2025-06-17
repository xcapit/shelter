import type { AssembledTransaction, Tx } from "@stellar/stellar-sdk/contract";
import type { Keypair, Transaction } from "shelter-sdk";
import { rpc } from "@stellar/stellar-sdk";
import type { Rpc } from "../rpc/rpc";

export class SimulatedTransaction {
  constructor(
    private readonly _rawTx: AssembledTransaction<any>,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) { }

  async result(): Promise<rpc.Api.GetTransactionResponse> {
    const tx = this._rawTx.built!;
    const simTx: any = await this._rpc.server().simulateTransaction(tx);
    const completeTx = this._rpc.assembleTransaction(tx, simTx as unknown as Transaction).build();
    completeTx.sign(this._signer);
    return await this._txData(completeTx);
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

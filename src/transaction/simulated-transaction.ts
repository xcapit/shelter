import type { AssembledTransaction, Tx } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";
import { rpc } from "@stellar/stellar-sdk";
import type { Rpc } from "../rpc/rpc";

export class SimulatedTransaction {
  constructor(
    private readonly _rawTx: AssembledTransaction<any>,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) { }

  async result(): Promise<rpc.Api.GetTransactionResponse> {
    console.log('simulate tx init');
    const tx = this._rawTx.built!;
    const simTx: any = await this._rpc.server().simulateTransaction(tx);
    console.log('simulated 1, result:', simTx);
    const completeTx = this._rpc.assembleTransaction(tx, simTx.transactionData.build()).build();
    console.log('simulated 2');
    completeTx.sign(this._signer);
    console.log('signed');
    return await this._txData(completeTx);
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

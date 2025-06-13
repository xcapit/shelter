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
    console.log('built raw tx', tx);
    const simTx: any = await this._rpc.server().simulateTransaction(tx);
    console.log('simulated 1, result:', simTx);
    // const assembledTx = this._rpc.assembleTransaction(tx, simTx);
    // console.log('assembled tx:', assembledTx);
    const completeTx = this._rpc.assembleTransaction(tx, simTx).build();
    console.log('simulated 2, completeTx:', completeTx);
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

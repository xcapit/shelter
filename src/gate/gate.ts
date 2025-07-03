import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import { Transaction } from "../transaction/transaction";
import type { Rpc } from "../rpc/rpc";


export class Gate {
  constructor(private _aClient: Client | FakeClient, private _aSteward: Keypair, private _aRpc: Rpc) { }

  async guard(): Promise<void> {
    await this._txOf(
      await this._aClient.guard(),
      'Guard Gate Error'
    ).result();
  }

  async open(): Promise<void> {
    await this._txOf(
      await this._aClient.open(),
      'Open Gate Error'
    ).result();
  }

  async seal(): Promise<void> {
    await this._txOf(
      await this._aClient.seal(),
      'Seal Gate Error'
    ).result();
  }

  _txOf(aRawTx: any, errorMsg: string): Transaction {
    return new Transaction(
      aRawTx,
      this._aSteward,
      this._aRpc,
      errorMsg
    )
  }
}

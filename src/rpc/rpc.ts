import {
  FeeBumpTransaction,
  rpc,
  Transaction,
  TransactionBuilder,
} from "shelter-sdk";
import type { FakeServer } from "../fixtures/fixtures";
import type { Api } from "@stellar/stellar-sdk/rpc";

export class Rpc {
  private _cachedNetwork: string = "";
  constructor(
    private readonly _server: rpc.Server | FakeServer,
    private readonly _rpc: any = rpc
  ) { }

  url(): string {
    return this._server.serverURL;
  }

  server(): rpc.Server | FakeServer {
    return this._server;
  }

  assembleTransaction(
    raw: Transaction | FeeBumpTransaction | any,
    simulation:
      | Api.SimulateTransactionResponse
      | Api.RawSimulateTransactionResponse | any
  ): TransactionBuilder | any {
    return this._rpc.assembleTransaction(raw, simulation);
  }

  async network(): Promise<string> {
    if (!this._cachedNetwork) {
      this._cachedNetwork = (await this._server.getNetwork()).passphrase;
    }
    return this._cachedNetwork;
  }
}

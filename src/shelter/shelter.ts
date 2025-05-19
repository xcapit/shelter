import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Client } from "shelter-sdk";

export class Shelter {
  constructor(
    private readonly _steward: string,
    private readonly _rpcUrl: string,
    private readonly _wasm: Buffer | string,
    private readonly _networkPassphrase: string,
    private readonly _deployFn: typeof Client.deploy = Client.deploy
  ) {}

  async deploy(): Promise<AssembledTransaction<Client>> {
    return await this._deployFn(
      { steward: this._steward },
      {
        wasmHash: this._wasm,
        networkPassphrase: this._networkPassphrase,
        rpcUrl: this._rpcUrl,
      }
    );
  }
}

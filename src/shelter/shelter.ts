import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Client, Keypair, Networks } from "shelter-sdk";
import type { Rpc } from "../rpc/rpc.interface";
import type { FakeClient } from "../fake-client/fake-client";

export class Shelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _wasm: Buffer | string,
    private readonly _networkPassphrase: Networks,
    private readonly _client: typeof Client | FakeClient = Client
  ) {}

  async deploy(): Promise<DeployedShelter> {
    return new DeployedShelter(
      this._steward,
      new this._client({
        contractId: await this._txHash(
          await this._client.deploy(
            { steward: this._steward.publicKey() },
            {
              wasmHash: this._wasm,
              networkPassphrase: this._networkPassphrase,
              rpcUrl: this._rpc.url(),
              publicKey: this._steward.publicKey(),
            }
          )
        ),
        networkPassphrase: this._networkPassphrase,
        rpcUrl: this._rpc.url(),
      })
    );
  }

  private async _txHash(rawTx: AssembledTransaction<Client>): Promise<string> {
    const shelterDeployTx = rawTx.built!;
    shelterDeployTx.sign(this._steward);
    return (await this._rpc.server().sendTransaction(shelterDeployTx)).hash;
  }
}

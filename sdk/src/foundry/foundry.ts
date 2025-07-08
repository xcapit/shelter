import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Shelter } from "../shelter/shelter";
import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import { StrKey, Address } from "@stellar/stellar-sdk";
import { Transaction } from "../transaction/transaction";
import type { Rpc } from "../rpc/rpc";

export class Foundry {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _wasm: Buffer | string,
    private readonly _client: typeof Client | typeof FakeClient = Client
  ) { }

  async newShelter(): Promise<Shelter> {
    return new Shelter(
      this._steward,
      this._rpc,
      new this._client({
        contractId: await this._address(await this._deploy()),
        networkPassphrase: await this._rpc.network(),
        rpcUrl: this._rpc.url(),
        publicKey: this._steward.publicKey(),
      })
    );
  }

  private async _deploy(): Promise<any> {
    return await this._client.deploy(
      { steward: this._steward.publicKey() },
      {
        wasmHash: this._wasm,
        networkPassphrase: await this._rpc.network(),
        rpcUrl: this._rpc.url(),
        publicKey: this._steward.publicKey(),
      }
    )
  }

  private async _address(rawTx: AssembledTransaction<Client>): Promise<string> {
    return this._addressOf(
      await new Transaction(rawTx, this._steward, this._rpc).result()
    );
  }

  private async _addressOf(txData: any) {
    return StrKey.encodeContract(
      Address.fromScAddress(txData.returnValue.address()).toBuffer()
    );
  }
}

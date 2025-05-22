import type { AssembledTransaction, Tx } from "@stellar/stellar-sdk/contract";
import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Client, Keypair, Networks } from "shelter-sdk";
import type { Rpc } from "../rpc/rpc.interface";
import type { FakeClient } from "../fake-client/fake-client";
import { StrKey, Address } from "@stellar/stellar-sdk";

export class Shelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _wasm: Buffer | string,
    private readonly _networkPassphrase: Networks,
    private readonly _client: typeof Client | typeof FakeClient = Client
  ) {}

  async deploy(): Promise<DeployedShelter> {
    return new DeployedShelter(
      this._steward,
      this._rpc,
      new this._client({
        contractId: await this._address(
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

  private async _address(rawTx: AssembledTransaction<Client>): Promise<string> {
    const shelterDeployTx = rawTx.built!;
    shelterDeployTx.sign(this._steward);
    return this._addressOf(await this._txData(shelterDeployTx));
  }

  private async _addressOf(txData: any) {
    return StrKey.encodeContract(
      Address.fromScAddress(txData.returnValue.address()).toBuffer()
    );
  }

  private async _txData(tx: Tx): Promise<any> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

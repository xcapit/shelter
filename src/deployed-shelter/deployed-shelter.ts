import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import type { Rpc } from "../rpc/rpc.interface";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _client: Client | FakeClient
  ) {}

  async stewardId(): Promise<string> {
    return (await this._client.steward()).result;
  }

  async boundAid(
    recipient: Buffer,
    token: string,
    amount: bigint,
    expiration: bigint
  ): Promise<void> {
    const tx = await this._client.bound_aid({
      recipient,
      token,
      amount,
      expiration,
    });
    const buildTx = tx.built!;
    buildTx.sign(this._steward);
    const buildTxResponse = await this._rpc
      .server()
      .pollTransaction(
        (
          await this._rpc.server().sendTransaction(buildTx)
        ).hash
      );
    if (buildTxResponse.status !== "SUCCESS") {
      throw new Error("aoeu");
    }
  }
}

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
  ): Promise<boolean> {
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
    //  const boundBuildTx = tx.built!;

    // boundBuildTx.sign(stewardKeypair);

    // const boundTx = await rpcServer.sendTransaction(boundBuildTx);
    // console.log("[BOUND AID HASH]:", boundTx.hash);

    // const boundTxResponse = await rpcServer.pollTransaction(boundTx.hash);
    // expect(boundTxResponse.status).toEqual("SUCCESS");
    return true;
  }
}

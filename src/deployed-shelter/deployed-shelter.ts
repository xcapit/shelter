import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import type { Rpc } from "../rpc/rpc.interface";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _client: Client | FakeClient
  ) { }

  async stewardId(): Promise<string> {
    return (await this._client.steward()).result;
  }
}

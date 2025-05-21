import { Client, Keypair } from "shelter-sdk";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import type { FakeClient } from "../fake-client/fake-client";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _client: Client | FakeClient
  ) {}

  async stewardId(): Promise<AssembledTransaction<string>> {
    console.log("client", this._client);
    return await this._client.steward();
  }
}

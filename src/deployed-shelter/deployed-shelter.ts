import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../shelter/shelter.test";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _client: Client | FakeClient // TODO:
  ) {}

  async stewardId(): Promise<AssembledTransaction<string>> {
    return await this._client.steward();
  }
}

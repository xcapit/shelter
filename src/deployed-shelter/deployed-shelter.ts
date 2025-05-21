import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../shelter/shelter.test";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _client: typeof Client | FakeClient // TODO:
  ) {}

  async stewardId(): Promise<string> {
    return await this._client.steward();
  }
}

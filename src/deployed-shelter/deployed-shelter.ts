import { Client, Keypair } from "shelter-sdk";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _client: Client
  ) {}
}

import { Keypair } from "@stellar/stellar-sdk";

export class SponsoredAccount {
  constructor(private readonly _keypair: Keypair) { }

  async address(): Promise<string> {
    return this._keypair.publicKey();
  }

  async secret(): Promise<string> {
    return this._keypair.secret();
  }
}

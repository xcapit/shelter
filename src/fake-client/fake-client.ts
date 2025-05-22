import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Client, Keypair } from "shelter-sdk";

export class FakeClient {
  constructor(
    private readonly _options: any,
    private readonly _steward: Keypair = Keypair.random()
  ) {}
  public static deploy() {
    return {
      built: { sign: () => {} },
    } as unknown as AssembledTransaction<Client>;
  }

  async steward(): Promise<any> {
    return Promise.resolve({
      result: this._steward.publicKey(),
    });
  }
}

import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";

export class FakeClient {
  constructor(
    private readonly _options: any,
    private readonly _steward: Keypair = Keypair.random()
  ) {}
  public static deploy() {
    return {
      built: { sign: () => {} },
    };
  }

  async steward(): Promise<AssembledTransaction<string>> {
    return Promise.resolve(
      this._steward.publicKey() as unknown as AssembledTransaction<string>
    );
  }
}

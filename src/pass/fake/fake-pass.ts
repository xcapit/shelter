import type { AssembledTransaction } from "@stellar/stellar-sdk/no-axios/contract";
import type { Keypair } from "shelter-sdk";

export class FakePass {
  constructor(private readonly _recipient: Keypair, private readonly _shelterId: string) { }

  async applyTo(tx: AssembledTransaction<null>) { }
}

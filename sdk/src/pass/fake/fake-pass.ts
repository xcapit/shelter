import type { Pass } from "../pass.interface";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class FakePass implements Pass {
  constructor() { }

  async applyTo(tx: AssembledTransaction<null>): Promise<AssembledTransaction<null>> {
    return tx;
  }
}

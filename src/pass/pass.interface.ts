import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export interface Pass {
  applyTo(tx: AssembledTransaction<null>): Promise<AssembledTransaction<null>>;
}

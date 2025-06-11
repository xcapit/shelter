import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export interface Pass {
  applyTo(tx: any): Promise<any>;
}

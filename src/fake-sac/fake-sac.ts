import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class FakeSAC {
  transfer({ from, to, amount }: { from: string; to: string; amount: bigint }) {
    return {
      built: { sign: () => {} },
    } as unknown as AssembledTransaction<null>;
  }
}

import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class FakeSAC {
  async transfer({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: bigint;
  }): Promise<AssembledTransaction<null>> {
    return {
      built: { sign: () => {} },
    } as unknown as AssembledTransaction<null>;
  }
}

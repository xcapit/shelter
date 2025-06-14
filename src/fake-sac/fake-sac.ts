import {contract} from "@stellar/stellar-sdk";

export class FakeSAC {
  async transfer({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: bigint;
  }): Promise<contract.AssembledTransaction<null>> {
    return {
      built: { sign: () => {} },
    } as unknown as contract.AssembledTransaction<null>;
  }
}

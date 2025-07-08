import { contract } from "@stellar/stellar-sdk";

export class FakeSAC {
  options = {
    contractId: 'aoeuueoa'
  };

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
      built: { sign: () => { } },
    } as unknown as contract.AssembledTransaction<null>;
  }

  async balance(options: any): Promise<any> {
    return { result: BigInt(1) };
  }
}

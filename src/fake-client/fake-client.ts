import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { Client, Keypair } from "shelter-sdk";

export class FakeClient {
  options = {
    contractId: "aContractId",
  };
  constructor(
    private readonly _options: any,
    private readonly _steward: Keypair = Keypair.random()
  ) {}
  public static deploy() {
    return {
      built: { sign: () => {} },
    } as unknown as AssembledTransaction<Client>;
  }

  async aid_of({
    recipient,
    token,
  }: {
    recipient: Buffer;
    token: string;
  }): Promise<any> {
    return Promise.resolve({
      result: {
        amount: 1,
        expiration: 1749653376464,
      },
    });
  }

  async steward(): Promise<any> {
    return Promise.resolve({
      result: this._steward.publicKey(),
    });
  }

  async bound_aid(options: any) {
    return {
      built: { sign: () => {} },
    } as unknown as AssembledTransaction<null>;
  }
}

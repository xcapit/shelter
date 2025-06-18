import { Keypair } from "shelter-sdk";
import { SimulatedTransaction } from "./simulated-transaction";
import { Rpc } from "../rpc/rpc";
import { FakeServer } from "../fixtures/fixtures";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class SponsoredTransaction {
  constructor(
    private readonly _innerTx: any,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) {}

  async result(): Promise<rpc.Api.GetTransactionResponse> {
    const feeBumpTransaction =
      StellarSDK.TransactionBuilder.buildFeeBumpTransaction(
        this._signer,
        StellarSDK.BASE_FEE * 2,
        this._innerTx,
        networkPassphrase,
    );

// Sign the fee-bump transaction with the fee account
feeBumpTransaction.sign(feeKeypair);

    return await this._txData(await this.value());
  }
}

describe("Simulated transaction", () => {
  const sponsor = Keypair.random();
  const _rpc = {
    assembleTransaction: (raw: any, simulation: any) => {
      return {
        build: () => ({ sign: () => {} }),
      };
    },
  };

  test("new", async () => {
    const sponsoredTransaction = new SponsoredTransaction(
      {} as unknown as AssembledTransaction<any>,
      sponsor,
      new Rpc(new FakeServer(), _rpc)
    );

    expect(sponsoredTransaction).toBeTruthy();
  });

  test("result", async () => {
    const sponsoredTransaction = new SponsoredTransaction(
      {} as unknown as AssembledTransaction<any>,
      sponsor,
      new Rpc(new FakeServer(), _rpc)
    );

    expect(sponsoredTransaction.result()).toBeTruthy();
  });
});

import { Keypair, rpc as StellarRpc } from "shelter-sdk";
import { Rpc } from "../rpc/rpc";
import { FakeServer } from "../fixtures/fixtures";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import * as StellarSDK from "@stellar/stellar-sdk";

export class SponsoredTransaction {
  constructor(
    private readonly _innerTx: any,
    private readonly _signer: Keypair,
    private readonly _rpc: Rpc
  ) {}

  async result(): Promise<StellarRpc.Api.GetTransactionResponse | void> {
    const feeBumpTransaction =
      StellarSDK.TransactionBuilder.buildFeeBumpTransaction(
        this._signer,
        (+StellarSDK.BASE_FEE * 2).toString(),
        this._innerTx,
        await this._rpc.network()
      );
    // feeBumpTransaction.sign(this._signer);
    // return await this._txData(feeBumpTransaction);
    return;
  }

  private async _txData(
    tx: StellarSDK.FeeBumpTransaction
  ): Promise<StellarRpc.Api.GetTransactionResponse> {
    return await this._rpc
      .server()
      .pollTransaction((await this._rpc.server().sendTransaction(tx)).hash);
  }
}

describe("Sponsored transaction", () => {
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

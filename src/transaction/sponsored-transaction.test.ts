import { Keypair, rpc as StellarRpc } from "shelter-sdk";
import { Rpc } from "../rpc/rpc";
import { FakeServer } from "../fixtures/fixtures";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import * as StellarSDK from "@stellar/stellar-sdk";

// Mock StellarSDK
jest.mock("@stellar/stellar-sdk", () => ({
  TransactionBuilder: {
    buildFeeBumpTransaction: jest.fn(),
  },
  BASE_FEE: "100",
}));

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
    feeBumpTransaction.sign(this._signer);
    return await this._txData(feeBumpTransaction);
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
  const mockFeeBumpTransaction = {
    sign: jest.fn(),
  };
  const mockTransactionResponse = {
    hash: "mock-hash",
    ledger: 1234,
    envelope_xdr: "mock-envelope",
    result_xdr: "mock-result",
    result_meta_xdr: "mock-meta",
    fee_meta_xdr: "mock-fee-meta",
    memo_type: "none",
    memo: null,
    signatures: [],
    valid_after: "2023-01-01T00:00:00Z",
    valid_before: "2023-01-01T00:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (StellarSDK.TransactionBuilder.buildFeeBumpTransaction as jest.Mock).mockReturnValue(mockFeeBumpTransaction);
  });

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
    const fakeServer = new FakeServer(mockTransactionResponse);
    const sponsoredTransaction = new SponsoredTransaction(
      {} as unknown as AssembledTransaction<any>,
      sponsor,
      new Rpc(fakeServer, _rpc)
    );

    const result = await sponsoredTransaction.result();
    
    expect(StellarSDK.TransactionBuilder.buildFeeBumpTransaction).toHaveBeenCalledWith(
      sponsor,
      "200",
      {},
      "aPassphrase"
    );
    expect(mockFeeBumpTransaction.sign).toHaveBeenCalledWith(sponsor);
    expect(result).toEqual(mockTransactionResponse);
  });
});

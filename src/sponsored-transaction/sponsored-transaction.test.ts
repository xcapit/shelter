import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { FeeBumpTxBuilt } from "../fee-bump-tx-built/fee-bump-tx-built";
import { SponsoredTransaction } from "./sponsored-transaction";
import { FakeServer } from "../fixtures/fixtures";
import { Keypair } from "shelter-sdk";
import { Rpc } from "../rpc/rpc";

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
      new Rpc(new FakeServer(), _rpc),
      new FeeBumpTxBuilt()
    );

    expect(sponsoredTransaction).toBeTruthy();
  });

  test("result", async () => {
    const sponsoredTransaction = new SponsoredTransaction(
      {} as unknown as AssembledTransaction<any>,
      sponsor,
      new Rpc(new FakeServer(), _rpc),
      {
        value: () => {
          return {
            sign: () => {},
          };
        },
      } as unknown as FeeBumpTxBuilt
    );

    expect(sponsoredTransaction.result()).toBeTruthy();
  });
});

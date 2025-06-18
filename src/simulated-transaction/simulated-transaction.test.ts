import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import { SimulatedTransaction } from "./simulated-transaction";
import { FakeServer } from "../fixtures/fixtures";
import { Keypair } from "shelter-sdk";
import { Rpc } from "../rpc/rpc";

describe("Simulated transaction", () => {
  const _rpc = {
    assembleTransaction: (raw: any, simulation: any) => {
      return {
        build: () => ({ sign: () => {} }),
      };
    },
  };

  test("value", async () => {
    const simulatedTransaction = new SimulatedTransaction(
      {} as unknown as AssembledTransaction<any>,
      Keypair.random(),
      new Rpc(new FakeServer(), _rpc)
    );

    expect(simulatedTransaction.value()).toBeTruthy();
  });
});

import { Keypair } from "shelter-sdk";
import { SimulatedTransaction } from "./simulated-transaction";
import { Rpc } from "../rpc/rpc";
import { FakeServer } from "../fixtures/fixtures";

describe('Simulated transaction', () => {
  test('value', async () => {
    new SimulatedTransaction({}, Keypair.random(), new Rpc(new FakeServer()))
  });
});

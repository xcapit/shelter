import { Keypair } from "shelter-sdk";
import { SimulatedTransaction } from "./simulated-transaction";
import { Rpc } from "../rpc/rpc";
import { FakeServer } from "../fixtures/fixtures";

describe('Simulated transaction', () => {
  const _rpc = {
      assembleTransaction: (raw: any, simulation: any) => {
        return {
          build: () => ({ sign: () => {} }),
        };
      },
    };

  test('value', async () => {
    pass
   // new SimulatedTransaction({} as unknown as AssembledTransaction<any>, Keypair.random(), new Rpc(new FakeServer(), _rpc))
  });

});

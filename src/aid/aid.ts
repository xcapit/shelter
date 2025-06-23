import { Keypair, rpc as StellarRpc } from "shelter-sdk";
import type { Client as SAC } from "sac-sdk";
import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Rpc } from "../rpc/rpc";
import type { Pass } from "../pass/pass.interface";
import { Transfer } from "../transfer/transfer";
import { FakeSAC } from "../fake-sac/fake-sac";
import { SimulatedTransaction } from "../simulated-transaction/simulated-transaction";

export class Aid {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _token: SAC | FakeSAC,
    private readonly _rpc: Rpc
  ) { }

  async transfer(
    deployedShelter: DeployedShelter,
    to: string,
    amount: bigint,
    pass: Pass
  ) {

    const resultTx = await new SimulatedTransaction(
      await new Transfer(deployedShelter.id(), to, amount, this._token).value(
        pass
      ),
      this._recipient,
      this._rpc
    ).result();

    if (resultTx.status !== StellarRpc.Api.GetTransactionStatus.SUCCESS) {
      console.log("Transfer Aid Error", JSON.stringify(resultTx, null, 2));
      throw new Error("TRANSFER AID ERROR");
    }
  }
}

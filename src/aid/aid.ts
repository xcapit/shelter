import { Keypair } from "shelter-sdk";
import type { Client as SAC } from "sac-sdk";
import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Rpc } from "../rpc/rpc";
import type { Pass } from "../pass/pass.interface";
import { Transfer } from "../transfer/transfer";
import { FakeSAC } from "../fake-sac/fake-sac";
import { Transaction } from "../transaction/transaction";

export class Aid {
  constructor(
    private readonly _sponsor: Keypair,
    private readonly _token: SAC | FakeSAC,
    private readonly _rpc: Rpc
  ) { }

  async transfer(
    deployedShelter: DeployedShelter,
    to: string,
    amount: bigint,
    pass: Pass
  ) {

    await new Transaction(
      await new Transfer(deployedShelter.id(), to, amount, this._token).value(
        pass
      ),
      this._sponsor,
      this._rpc,
      "Transfer Aid Error",
      true
    ).result();
  }
}

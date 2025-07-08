import { Keypair } from "shelter-sdk";
import type { Client as SAC } from "sac-sdk";
import { Shelter } from "../shelter/shelter";
import { Rpc } from "../rpc/rpc";
import type { Pass } from "../pass/pass.interface";
import { Transfer } from "../transfer/transfer";
import { FakeSAC } from "../fake-sac/fake-sac";
import { Transaction } from "../transaction/transaction";

export class Aid {
  constructor(
    private readonly _recipient: Keypair,
    private readonly _sponsor: Keypair,
    private readonly _token: SAC | FakeSAC,
    private readonly _shelter: Shelter,
    private readonly _rpc: Rpc
  ) { }

  async bound(amount: bigint, expiration: bigint): Promise<void> {
    await this._shelter.boundAid(
      this._recipient.rawPublicKey(),
      this._token.options.contractId,
      amount,
      expiration
    );
  }

  async unbound(): Promise<void> {
    await this._shelter.unboundAid(
      this._recipient.rawPublicKey(),
      this._token.options.contractId,
    );
  }

  async transfer(to: string, amount: bigint, pass: Pass) {

    await new Transaction(
      await new Transfer(this._shelter.id(), to, amount, this._token).value(
        pass
      ),
      this._sponsor,
      this._rpc,
      "Transfer Aid Error",
      true
    ).result();
  }
}

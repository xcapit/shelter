import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import { Transaction } from "../transaction/transaction";
import type { Rpc } from "../rpc/rpc";
import { Gate } from "../gate/gate";

export class Shelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _client: Client | FakeClient
  ) { }

  async stewardId(): Promise<string> {
    return (await this._client.steward()).result;
  }

  async boundAid(
    recipient: Buffer,
    token: string,
    amount: bigint,
    expiration: bigint
  ): Promise<void> {
    await this._txOf(
      await this._client.bound_aid({
        recipient,
        token,
        amount,
        expiration,
      }),
      'Bound Aid Error'
    ).result();
  }

  async unboundAid(
    recipient: Buffer,
    token: string,
  ): Promise<void> {
    await this._txOf(
      await this._client.unbound_aid({
        recipient,
        token,
      }),
      'Unbound Aid Error'
    ).result();
  }

  id(): string {
    return this._client.options.contractId;
  }

  async aidOf(recipient: Buffer, token: string): Promise<bigint> {
    return (await this._client.aid_of({ recipient, token })).result.amount;
  }

  async updateSteward(newSteward: Keypair): Promise<void> {
    await this._txOf(
      await this._client.update_steward({
        new_steward: newSteward.publicKey(),
      }),
      'Update Steward Error'
    ).result();
  }

  gate(): Gate {
    return new Gate(this._client, this._steward, this._rpc);
  }

  _txOf(aRawTx: any, errorMsg: string): Transaction {
    return new Transaction(
      aRawTx,
      this._steward,
      this._rpc,
      errorMsg
    )
  }
}

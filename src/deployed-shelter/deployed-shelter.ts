import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import { Transaction } from "../transaction/transaction";
import type { Rpc } from "../rpc/rpc";

export class DeployedShelter {
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
    await new Transaction(
      await this._client.bound_aid({
        recipient,
        token,
        amount,
        expiration,
      }),
      this._steward,
      this._rpc,
      'Bound Aid Error'
    ).result();
  }

  id(): string {
    return this._client.options.contractId;
  }

  async aidOf(recipient: Buffer, token: string): Promise<bigint> {
    return (await this._client.aid_of({ recipient, token })).result.amount;
  }

  async guard(): Promise<void> {
    await new Transaction(
      await this._client.guard(),
      this._steward,
      this._rpc,
      'Guard Gate Error'
    ).result();
  }

  async open(): Promise<void> {
    await new Transaction(
      await this._client.open(),
      this._steward,
      this._rpc,
      'Open Gate Error'
    ).result();
  }

  async seal(): Promise<void> {
    await new Transaction(
      await this._client.seal(),
      this._steward,
      this._rpc,
      'Seal Gate Error'
    ).result();
  }
}

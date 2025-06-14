import { rpc } from "@stellar/stellar-sdk";
import { Client, Keypair } from "shelter-sdk";
import type { FakeClient } from "../fake-client/fake-client";
import { Transaction } from "../transaction/transaction";
import type { Rpc } from "../rpc/rpc";

export class DeployedShelter {
  constructor(
    private readonly _steward: Keypair,
    private readonly _rpc: Rpc,
    private readonly _client: Client | FakeClient
  ) {}

  async stewardId(): Promise<string> {
    return (await this._client.steward()).result;
  }

  async boundAid(
    recipient: Buffer,
    token: string,
    amount: bigint,
    expiration: bigint
  ): Promise<void> {
    const resultTx = await new Transaction(
      await this._client.bound_aid({
        recipient,
        token,
        amount,
        expiration,
      }),
      this._steward,
      this._rpc
    ).result();
    if (resultTx.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
      console.log("Bound Aid Error", JSON.stringify(resultTx, null, 2));
      throw new Error("BOUND AID ERROR");
    }
  }

  id(): string {
    return this._client.options.contractId;
  }

  async aidOf(recipient: Buffer, token: string): Promise<bigint> {
    return (await this._client.aid_of({ recipient, token })).result.amount;
  }
}

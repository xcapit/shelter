import { Client as SAC } from "sac-sdk";
import { FakeSAC } from "../fake-sac/fake-sac";
import type { Pass } from "../pass/pass.interface";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class Transfer {
  constructor(
    private readonly _from: string,
    private readonly _to: string,
    private readonly _amount: bigint,
    private readonly _token: SAC | FakeSAC
  ) { }

  async value(withPass: Pass): Promise<AssembledTransaction<null>> {
    return await withPass.applyTo(await this._token.transfer({
      from: this._from,
      to: this._to,
      amount: this._amount,
    }));
  }
}

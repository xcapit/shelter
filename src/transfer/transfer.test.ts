import { Client as SAC } from "sac-sdk";
import { FakeSAC } from "../fake-sac/fake-sac";
import type { Pass } from "../pass/pass.interface";
import { FakePass } from "../pass/fake/fake-pass";

export class Transfer {
  constructor(
    private readonly _from: string,
    private readonly _to: string,
    private readonly _amount: bigint,
    private readonly _token: SAC | FakeSAC
  ) {}

  async value(withPass: Pass) {
    return await withPass.applyTo(
      await this._token.transfer({
        from: this._from,
        to: this._to,
        amount: this._amount,
      })
    );
  }
}

describe("transfer", () => {
  const from = "CBDH3NC57SPUG2T4HGTR5AIVNEUDIXMEI4SBGZNAS2LPJJMJC7NZWNKF";
  const to = "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM";
  const amount = BigInt(1);
  const token = new FakeSAC();

  test("new", () => {
    expect(new Transfer(from, to, amount, token)).toBeTruthy();
  });

  test("value", async () => {
    expect(
      new Transfer(from, to, amount, token).value(new FakePass())
    ).toBeTruthy();
  });
});

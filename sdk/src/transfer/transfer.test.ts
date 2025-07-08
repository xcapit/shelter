import { FakeSAC } from "../fake-sac/fake-sac";
import { FakePass } from "../pass/fake/fake-pass";
import { Transfer } from "./transfer";

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

import { Keypair, Networks, Client as SAC } from "sac-sdk";
import { FakeRpc } from "../rpc/fake/fake-rpc";
import type { FakeSAC } from "../fake-sac/fake-sac";

export class Transfer {
  constructor(
    private readonly _from: string,
    private readonly _to: string,
    private readonly _amount: bigint,
    private readonly _token: SAC | FakeSAC
  ) { }

  async execute() {
    await this._token.transfer({ from: this._from, to: this._to, amount: this._amount });
    return true;
  }
}

describe("transfer", () => {
  const from = "CBDH3NC57SPUG2T4HGTR5AIVNEUDIXMEI4SBGZNAS2LPJJMJC7NZWNKF";
  const to = "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM";
  const amount = BigInt(1);
  const tokenContractId = 'CCQK3OJ5T4A5B4SDKQWH7PQKC5HMUZHIGUWF2INTKDQB32F3YPEW7L27'
  const recipient = Keypair.random();
  const token = new SAC({
    contractId: tokenContractId,
    networkPassphrase: Networks.TESTNET,
    rpcUrl: new FakeRpc().url(),
    publicKey: recipient.publicKey(),
  });


  test("new", () => {
    expect(new Transfer(from, to, amount, token)).toBeTruthy();
  });

  test("execute", async () => {
    expect(new Transfer(from, to, amount, token).execute()).toBeTruthy();
  });
});

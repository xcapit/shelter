import { Keypair, Networks, Client as SAC } from "sac-sdk";
import { FakeRpc } from "../rpc/fake/fake-rpc";
export class Transfer {
  constructor(
    private readonly _from: string,
    private readonly _to: string,
    private readonly _amount: bigint,
    private readonly _token: SAC // SAC
  ) {}

  execute() {
    return true;
  }
}

describe("transfer", () => {
  const from = "";
  const to = "";
  const amount = BigInt(1);
  const tokenContractId = ''
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

  test("execute", () => {
    expect(new Transfer(from, to, amount, token).execute()).toBeTruthy();
  });
});

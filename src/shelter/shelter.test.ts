import { Client, Keypair, Networks } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeRpc } from "../rpc/fake/fake-rpc";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

export class FakeClient {
  constructor(
    private readonly _options: any,
    private readonly _steward: Keypair = Keypair.random()
  ) {}
  public static deploy() {
    return {
      built: { sign: () => {} },
    };
  }

  async steward(): Promise<AssembledTransaction<string>> {
    return Promise.resolve(
      this._steward.publicKey() as unknown as AssembledTransaction<string>
    );
  }
}
describe("Shelter", () => {
  const networkPassphrase = Networks.TESTNET;
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";

  test("new", () => {
    expect(
      new Shelter(steward, new FakeRpc(), wasmHash, networkPassphrase)
    ).toBeTruthy();
  });

  test("deploy", async () => {
    expect(
      await new Shelter(
        steward,
        new FakeRpc(),
        wasmHash,
        networkPassphrase,
        FakeClient
      ).deploy()
    ).toBeTruthy();
  });
});

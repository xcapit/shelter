import { Client, Keypair, Networks } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeRpc } from "../rpc/fake/fake-rpc";

class FakeClient {
  constructor(private readonly _options: any) {}
  public static deploy() {
    return {
      built: { sign: () => {} },
    };
  }
}
describe("Shelter", () => {
  const networkPassphrase = Networks.TESTNET;
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";
  const deployFn = () => {};
  const client;

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
        deployFn as unknown as typeof Client.deploy
      ).deploy()
    ).toBeTruthy();
  });
});

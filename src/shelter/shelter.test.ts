import { Keypair, Networks } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeRpc } from "../rpc/fake/fake-rpc";
import { FakeClient } from "../fake-client/fake-client";

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

import { Client, Keypair, Networks } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeRpc } from "../rpc/fake/fake-rpc";

describe("Shelter", () => {
  const networkPassphrase = Networks.TESTNET;
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";
  const deployFn = () => {
    return {
      built: { sign: () => {} },
    };
  };

  test("new", () => {
    expect(
      new Shelter(steward, new FakeRpc(), wasmHash, networkPassphrase)
    ).toBeTruthy();
  });

  // TODO: Se puede mejorar el assert de este test? Capaz hacerle un .steward al DeployedShelter o algo?
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

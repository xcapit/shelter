import { Client } from "shelter-sdk";
import { Shelter } from "./shelter";

describe("Shelter", () => {
  const rpcUrl = "anRpcUrl";
  const networkPassphrase = "aNetworkPassphrase";
  const steward = "aSteward";
  const wasmHash = "aWasmHash";
  const deployFn = () => {
    return Promise.resolve("aDeployedHash");
  };

  test("new", () => {
    expect(
      new Shelter(steward, rpcUrl, wasmHash, networkPassphrase)
    ).toBeTruthy();
  });

  test("deploy", async () => {
    expect(
      await new Shelter(
        steward,
        rpcUrl,
        wasmHash,
        networkPassphrase,
        deployFn as unknown as typeof Client.deploy
      ).deploy()
    ).toEqual("aDeployedHash");
  });
});

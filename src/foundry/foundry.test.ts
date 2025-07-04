import { Keypair } from "shelter-sdk";
import { Foundry } from "./foundry";
import { FakeClient } from "../fake-client/fake-client";
import {
  contractAddressTxReponse,
  FakeServer,
} from "../fixtures/fixtures";
import { Rpc } from "../rpc/rpc";

describe("Foundry", () => {
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";

  test("new", () => {
    expect(
      new Foundry(
        steward,
        new Rpc(new FakeServer()),
        wasmHash,
      )
    ).toBeTruthy();
  });

  test("deploy", async () => {
    expect(
      await new Foundry(
        steward,
        new Rpc(new FakeServer(contractAddressTxReponse)),
        wasmHash,
        FakeClient
      ).newShelter()
    ).toBeTruthy();
  });
});

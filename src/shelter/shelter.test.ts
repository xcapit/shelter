import { Keypair } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeClient } from "../fake-client/fake-client";
import {
  contractAddressTransactionReponse,
  FakeServer,
} from "../fixtures/fixtures";
import { Rpc } from "../rpc/rpc";

describe("Shelter", () => {
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";

  test("new", () => {
    expect(
      new Shelter(
        steward,
        new Rpc(new FakeServer()),
        wasmHash,
      )
    ).toBeTruthy();
  });

  test("deploy", async () => {
    expect(
      await new Shelter(
        steward,
        new Rpc(new FakeServer(contractAddressTransactionReponse)),
        wasmHash,
        FakeClient
      ).deploy()
    ).toBeTruthy();
  });
});

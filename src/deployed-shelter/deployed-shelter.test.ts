import { Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";
import { FakeRpc } from "../rpc/fake/fake-rpc";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const rpc = new FakeRpc()
  const client = new FakeClient({}, steward);
  let deployedShelter: DeployedShelter;

  beforeAll(() => {
    deployedShelter = new DeployedShelter(steward, rpc, client);
  });

  test("new", () => {
    expect(new DeployedShelter(steward, rpc, client)).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(await deployedShelter.stewardId()).toEqual(steward.publicKey());
  });
});

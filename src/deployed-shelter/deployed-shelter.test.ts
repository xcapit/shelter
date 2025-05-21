import { Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const client = new FakeClient({}, steward);
  let deployedShelter: DeployedShelter;

  beforeAll(() => {
    deployedShelter = new DeployedShelter(steward, client);
  });

  test("new", () => {
    expect(new DeployedShelter(steward, client)).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(await deployedShelter.stewardId()).toEqual(steward.publicKey());
  });
});

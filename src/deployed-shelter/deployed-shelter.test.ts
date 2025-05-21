import { Client, Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../shelter/shelter.test";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const client = new FakeClient({})
  let deployedShelter: DeployedShelter;
  beforeAll(()=>{
    deployedShelter = new DeployedShelter(steward, client)
  })
  test("new", () => {
    expect(new DeployedShelter(steward, client)).toBeTruthy();
  });

  test("id", async () => {
    expect(await deployedShelter.stewardId()).toEqual(steward.publicKey());
  });

});

import { Client, Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const client = {} as unknown as Client;
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

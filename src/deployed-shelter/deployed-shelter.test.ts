import { Client, Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const client = {} as unknown as Client;

  test("new", () => {
    expect(new DeployedShelter(steward, client)).toBeTruthy();
  });

});

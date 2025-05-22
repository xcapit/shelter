import { Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";
import { FakeRpc } from "../rpc/fake/fake-rpc";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const rpc = new FakeRpc()
  const client = new FakeClient({}, steward);
  let deployedShelter: DeployedShelter;
  const merch = Keypair.fromPublicKey("GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM");
  const _validExpiration = Math.floor(Date.now() / 1000) + 7200;
  const amount = 1;
//  recipient: bob.rawPublicKey(),
//       token: tokenContractId,
//       amount: BigInt(amount),
//       expiration: BigInt(_validExpiration),
  beforeAll(() => {
    deployedShelter = new DeployedShelter(steward, rpc, client);
  });

  test("new", () => {
    expect(new DeployedShelter(steward, rpc, client)).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(await deployedShelter.stewardId()).toEqual(steward.publicKey());
  });

  test("boundAid", async() => {
    expect(await deployedShelter.boundAid()).toBeTruthy()
  })
});

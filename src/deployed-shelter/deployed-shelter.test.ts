import { rpc } from "@stellar/stellar-sdk";
import { Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";
import { FakeRpc } from "../rpc/fake/fake-rpc";
import { contractAddressTransactionReponse } from "../fixtures/fixtures";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const fakeRpc = new FakeRpc();
  const client = new FakeClient({}, steward);
  let deployedShelter: DeployedShelter;
  const recipient = Keypair.fromPublicKey(
    "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM"
  );
  const tokenContractId =
    "CCQK3OJ5T4A5B4SDKQWH7PQKC5HMUZHIGUWF2INTKDQB32F3YPEW7L27";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);

  beforeAll(() => {
    deployedShelter = new DeployedShelter(steward, fakeRpc, client);
  });

  test("new", () => {
    expect(new DeployedShelter(steward, fakeRpc, client)).toBeTruthy();
  });

  test("id", () => {
    expect(new DeployedShelter(steward, fakeRpc, client).id()).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(
      await new DeployedShelter(
        steward,
        new FakeRpc(contractAddressTransactionReponse),
        client
      ).stewardId()
    ).toEqual(steward.publicKey());
  });

  test("boundAid", async () => {
    const _pollTransactionReponse = { status: rpc.Api.GetTransactionStatus.SUCCESS };

    await expect(
      new DeployedShelter(steward, new FakeRpc(_pollTransactionReponse), client).boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).resolves.toBeUndefined();
  });


  test("failed boundAid", async () => {
    const _pollTransactionReponse = { status: rpc.Api.GetTransactionStatus.NOT_FOUND };

    await expect(
      new DeployedShelter(steward, new FakeRpc(_pollTransactionReponse), client).boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).rejects.toThrow();
  });
});

import { rpc } from "@stellar/stellar-sdk";
import { Keypair } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";
import {
  contractAddressTxReponse,
  FakeServer,
} from "../fixtures/fixtures";
import { Rpc } from "../rpc/rpc";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const newSteward = Keypair.random();
  const fakeRpc = new Rpc(new FakeServer());
  const client = new FakeClient({}, steward);
  const recipient = Keypair.fromPublicKey(
    "GASL6XDOK2TO6SCFTXFN2HQDAONLBID2GKX5TYBTHOWA7ZU7VRFZNHGM"
  );
  const tokenContractId =
    "CCQK3OJ5T4A5B4SDKQWH7PQKC5HMUZHIGUWF2INTKDQB32F3YPEW7L27";
  const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);
  const amount = BigInt(1);
  const pollTxReponseSuccess = {
    status: rpc.Api.GetTransactionStatus.SUCCESS,
  };
  const pollTxReponseNotFound = {
    status: rpc.Api.GetTransactionStatus.NOT_FOUND,
  };
  const _deployedShelter = (aFakeServer: FakeServer = new FakeServer()) => (
    new DeployedShelter(
      steward,
      new Rpc(aFakeServer),
      client
    )
  );

  test("new", () => {
    expect(new DeployedShelter(steward, fakeRpc, client)).toBeTruthy();
  });

  test("id", () => {
    expect(_deployedShelter().id()).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(
      await _deployedShelter(
        new FakeServer(contractAddressTxReponse)
      ).stewardId()
    ).toEqual(steward.publicKey());
  });

  test("boundAid", async () => {
    await expect(
      _deployedShelter(
        new FakeServer(pollTxReponseSuccess)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).resolves.toBeUndefined();
  });

  test("update steward", async () => {
    await expect(
      _deployedShelter(
        new FakeServer(pollTxReponseSuccess)
      ).updateSteward(newSteward)
    ).resolves.toBeUndefined();
  });

  test("failed boundAid", async () => {
    await expect(
      _deployedShelter(
        new FakeServer(pollTxReponseNotFound)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).rejects.toThrow();
  });

  test("aidOf", async () => {
    await expect(
      _deployedShelter().aidOf(
        recipient.rawPublicKey(),
        tokenContractId
      )
    ).resolves.toEqual(1);
  });

  test("update steward", async () => {
    await expect(
      _deployedShelter(
        new FakeServer(pollTxReponseSuccess)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).resolves.toBeUndefined();
  });

  test("gate manipulation", async () => {
    const shelter = _deployedShelter(new FakeServer(pollTxReponseSuccess));

    await expect(shelter.gate().guard()).resolves.toBeUndefined();
    await expect(shelter.gate().open()).resolves.toBeUndefined();
    await expect(shelter.gate().seal()).resolves.toBeUndefined();
  });


  test("gate manipulation failed", async () => {
    const shelter = _deployedShelter(new FakeServer(pollTxReponseNotFound));

    await expect(shelter.gate().guard()).rejects.toThrow();
    await expect(shelter.gate().open()).rejects.toThrow();
    await expect(shelter.gate().seal()).rejects.toThrow();
  });
});

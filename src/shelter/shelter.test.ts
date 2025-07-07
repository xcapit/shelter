import { Keypair } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeClient } from "../fake-client/fake-client";
import {
  contractAddressTxReponse,
  FakeServer,
  FakeStellarRpc,
  pollTxReponseNotFound,
  pollTxReponseSuccess,
} from "../fixtures/fixtures";
import { Rpc } from "../rpc/rpc";
import { FakeSAC } from "../fake-sac/fake-sac";
import { FakePass } from "../pass/fake/fake-pass";

describe("Shelter", () => {
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
  const _shelter = (aFakeServer: FakeServer = new FakeServer()) => (
    new Shelter(
      steward,
      new Rpc(aFakeServer, new FakeStellarRpc()),
      client
    )
  );

  test("new", () => {
    expect(new Shelter(steward, fakeRpc, client)).toBeTruthy();
  });

  test("id", () => {
    expect(_shelter().id()).toBeTruthy();
  });

  test("stewardId", async () => {
    expect(
      await _shelter(
        new FakeServer(contractAddressTxReponse)
      ).stewardId()
    ).toEqual(steward.publicKey());
  });

  test("boundAid", async () => {
    await expect(
      _shelter(
        new FakeServer(pollTxReponseSuccess)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).resolves.toBeUndefined();
  });

  test("update steward", async () => {
    await expect(
      _shelter(
        new FakeServer(pollTxReponseSuccess)
      ).updateSteward(newSteward)
    ).resolves.toBeUndefined();
  });

  test("update release key", async () => {
    await expect(
      _shelter(
        new FakeServer(pollTxReponseSuccess)
      ).updateReleaseKey(steward.rawPublicKey())
    ).resolves.toBeUndefined();
  });

  test("failed boundAid", async () => {
    await expect(
      _shelter(
        new FakeServer(pollTxReponseNotFound)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).rejects.toThrow();
  });

  test("aidOf", async () => {
    await expect(
      _shelter().aidOf(
        recipient.rawPublicKey(),
        tokenContractId
      )
    ).resolves.toEqual(1);
  });

  test("update steward", async () => {
    await expect(
      _shelter(
        new FakeServer(pollTxReponseSuccess)
      ).boundAid(recipient.rawPublicKey(), tokenContractId, amount, expiration)
    ).resolves.toBeUndefined();
  });

  test("withdraw", async () => {
    const shelter = _shelter(new FakeServer(pollTxReponseSuccess));
    shelter.gate().seal();

    await expect(shelter.withdraw(new FakeSAC(), new FakePass())).resolves.toBeUndefined();
  });

  test("gate manipulation", async () => {
    const shelter = _shelter(new FakeServer(pollTxReponseSuccess));

    await expect(shelter.gate().guard()).resolves.toBeUndefined();
    await expect(shelter.gate().open()).resolves.toBeUndefined();
    await expect(shelter.gate().seal()).resolves.toBeUndefined();
  });


  test("gate manipulation failed", async () => {
    const shelter = _shelter(new FakeServer(pollTxReponseNotFound));

    await expect(shelter.gate().guard()).rejects.toThrow();
    await expect(shelter.gate().open()).rejects.toThrow();
    await expect(shelter.gate().seal()).rejects.toThrow();
  });
});

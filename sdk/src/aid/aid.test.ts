import { Shelter } from "../shelter/shelter";
import { Keypair } from "shelter-sdk";
import { FakeClient } from "../fake-client/fake-client";
import { FakePass } from "../pass/fake/fake-pass";
import { FakeServer, FakeStellarRpc, pollTxReponseNotFound, pollTxReponseSuccess } from "../fixtures/fixtures";
import { FakeSAC } from "../fake-sac/fake-sac";
import { Rpc } from "../rpc/rpc";
import { Aid } from "./aid";

describe("Aid", () => {
  const amount = BigInt(123);
  const sponsor = Keypair.random();
  const recipient = Keypair.random();
  const rpc = new Rpc(new FakeServer(), new FakeStellarRpc());
  const deployedShelter = new Shelter(
    Keypair.random(),
    rpc,
    new FakeClient({})
  );
  const _aidWith = (aResponse: any, aShelter: Shelter = deployedShelter) => (
    new Aid(
      recipient,
      sponsor,
      new FakeSAC(),
      aShelter,
      new Rpc(new FakeServer(aResponse), new FakeStellarRpc())
    )
  );

  test("new", () => {
    expect(new Aid(recipient, sponsor, new FakeSAC(), deployedShelter, rpc)).toBeTruthy();
  });

  test("transfer", async () => {
    await expect(
      _aidWith(pollTxReponseSuccess).transfer("to", amount, new FakePass())
    ).resolves.toBeUndefined();
  });

  test("transfer failed", async () => {
    await expect(
      _aidWith(pollTxReponseNotFound).transfer("to", amount, new FakePass())
    ).rejects.toThrow();
  });

  test("bound", async () => {
    const deployedShelter = new Shelter(
      Keypair.random(),
      new Rpc(new FakeServer(pollTxReponseSuccess), new FakeStellarRpc()),
      new FakeClient({})
    );
    const expiration = BigInt(Math.floor(Date.now() / 1000) + 7200);

    await expect(
      _aidWith(pollTxReponseSuccess, deployedShelter).bound(amount, expiration)
    ).resolves.toBeUndefined();
  });

  test("unbound", async () => {
    const deployedShelter = new Shelter(
      Keypair.random(),
      new Rpc(new FakeServer(pollTxReponseSuccess), new FakeStellarRpc()),
      new FakeClient({})
    );

    await expect(
      _aidWith(pollTxReponseSuccess, deployedShelter).unbound()
    ).resolves.toBeUndefined();
  });
});

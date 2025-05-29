import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Keypair, rpc as StellarRpc } from "shelter-sdk";
import { FakeClient } from "../fake-client/fake-client";
import { FakePass } from "../pass/fake/fake-pass";
import { FakeServer } from "../fixtures/fixtures";
import { FakeSAC } from "../fake-sac/fake-sac";
import { Rpc } from "../rpc/rpc";
import { Aid } from "./aid";

describe("Aid", () => {
  const amount = BigInt(123);
  const recipient = Keypair.random();
  const _rpc = {
    assembleTransaction: (raw: any, simulation: any) => {
      return {
        build: () => ({ sign: () => {} }),
      };
    },
  };

  const rpc = new Rpc(new FakeServer(), _rpc);
  const deployedShelter = new DeployedShelter(
    Keypair.random(),
    rpc,
    new FakeClient({})
  );

  test("new", () => {
    expect(new Aid(recipient, new FakeSAC(), rpc)).toBeTruthy();
  });

  test("transfer", async () => {
    const _pollTransactionReponse = {
      status: StellarRpc.Api.GetTransactionStatus.SUCCESS,
    };
    await expect(
      new Aid(
        recipient,
        new FakeSAC(),
        new Rpc(new FakeServer(_pollTransactionReponse), _rpc)
      ).transfer(deployedShelter, "to", amount, new FakePass())
    ).resolves.toBeUndefined();
  });

  test("transfer failed", async () => {
    const _pollTransactionReponse = {
      status: StellarRpc.Api.GetTransactionStatus.NOT_FOUND,
    };
    await expect(
      new Aid(
        recipient,
        new FakeSAC(),
        new Rpc(new FakeServer(_pollTransactionReponse), _rpc)
      ).transfer(deployedShelter, "to", amount, new FakePass())
    ).rejects.toThrow();
  });
});

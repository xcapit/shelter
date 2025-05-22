import { Keypair, xdr } from "shelter-sdk";
import { DeployedShelter } from "./deployed-shelter";
import { FakeClient } from "../fake-client/fake-client";
import { FakeRpc } from "../rpc/fake/fake-rpc";

describe("DeployedShelter", () => {
  const steward = Keypair.random();
  const rpc = new FakeRpc();
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
    deployedShelter = new DeployedShelter(steward, rpc, client);
  });

  test("new", () => {
    expect(new DeployedShelter(steward, rpc, client)).toBeTruthy();
  });

  test("stewardId", async () => {
    const _pollTransactionReponse = {
      returnValue: {
        address: (): xdr.ScAddress => {
          return xdr.ScAddress.scAddressTypeContract(
            Buffer.from(
              "227ca7b59a114b96adc361d1d5ce76cb1e2ffe6fa797296749638fded54f9550",
              "hex"
            )
          );
        },
      },
    };

    expect(
      await new DeployedShelter(
        steward,
        new FakeRpc(_pollTransactionReponse),
        client
      ).stewardId()
    ).toEqual(steward.publicKey());
  });

  test("boundAid", async () => {
    const _pollTransactionReponse = { status: 'SUCCESS' };

    expect(
      await new DeployedShelter(steward, new FakeRpc(_pollTransactionReponse), client).boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).toBeTruthy();
  });


  test("failed boundAid", async () => {
    const _pollTransactionReponse = { status: 'NOT_FOUND' };

    expect(async () =>
      await new DeployedShelter(steward, new FakeRpc(_pollTransactionReponse), client).boundAid(
        recipient.rawPublicKey(),
        tokenContractId,
        amount,
        expiration
      )
    ).toThrow();
  });
});

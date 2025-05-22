import { Keypair, Networks, xdr } from "shelter-sdk";
import { Shelter } from "./shelter";
import { FakeRpc } from "../rpc/fake/fake-rpc";
import { FakeClient } from "../fake-client/fake-client";

describe("Shelter", () => {
  const networkPassphrase = Networks.TESTNET;
  const steward = Keypair.random();
  const wasmHash = "aWasmHash";

  test("new", () => {
    expect(
      new Shelter(steward, new FakeRpc(), wasmHash, networkPassphrase)
    ).toBeTruthy();
  });

  test("deploy", async () => {
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
      await new Shelter(
        steward,
        new FakeRpc(_pollTransactionReponse),
        wasmHash,
        networkPassphrase,
        FakeClient
      ).deploy()
    ).toBeTruthy();
  });
});

import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";
import { xdr } from "@stellar/stellar-sdk";
export class FakeRpc implements Rpc {
  url(): string {
    return "aRpcUrl";
  }
  server(): rpc.Server {
    return {
      sendTransaction: (tx: any) => {
        return { hash: "aTxHash" };
      },
      pollTransaction: (hash: string) => {
        return {
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
      },
    } as unknown as rpc.Server;
  }
}

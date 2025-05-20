import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";

export class FakeRpc implements Rpc {
  url(): string {
    return "aRpcUrl";
  }
  server(): rpc.Server {
    return {
      sendTransaction: (tx: any) => {
        return { hash: "aTxHash" };
      },
    } as unknown as rpc.Server;
  }
}

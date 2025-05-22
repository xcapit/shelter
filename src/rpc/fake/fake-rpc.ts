import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";
export class FakeRpc implements Rpc {
  constructor(private readonly _pollTransactionReponse: any = {}) {}
  url(): string {
    return "aRpcUrl";
  }
  server(): rpc.Server {
    return {
      sendTransaction: (tx: any) => {
        return { hash: "aTxHash" };
      },
      pollTransaction: (hash: string) => {
        return this._pollTransactionReponse;
      },
    } as unknown as rpc.Server;
  }
}

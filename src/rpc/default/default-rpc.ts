import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";

export class DefaultRpc implements Rpc {
  constructor(private readonly _rpcUrl: string) {}

  url(): string {
    return this._rpcUrl;
  }

  server(): rpc.Server {
    return new rpc.Server(this._rpcUrl);
  }
}

import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";
export declare class DefaultRpc implements Rpc {
    private readonly _rpcUrl;
    constructor(_rpcUrl: string);
    url(): string;
    server(): rpc.Server;
}

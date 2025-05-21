import { rpc } from "shelter-sdk";
import type { Rpc } from "../rpc.interface";
export declare class FakeRpc implements Rpc {
    url(): string;
    server(): rpc.Server;
}

import type { rpc } from "shelter-sdk";
export interface Rpc {
    url(): string;
    server(): rpc.Server;
}

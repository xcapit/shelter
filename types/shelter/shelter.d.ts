import { DeployedShelter } from "../deployed-shelter/deployed-shelter";
import { Client, Keypair, Networks } from "shelter-sdk";
import type { Rpc } from "../rpc/rpc.interface";
export declare class Shelter {
    private readonly _steward;
    private readonly _rpc;
    private readonly _wasm;
    private readonly _networkPassphrase;
    private readonly _deployFn;
    constructor(_steward: Keypair, _rpc: Rpc, _wasm: Buffer | string, _networkPassphrase: Networks, _deployFn?: typeof Client.deploy);
    deploy(): Promise<DeployedShelter>;
    private _txHash;
}

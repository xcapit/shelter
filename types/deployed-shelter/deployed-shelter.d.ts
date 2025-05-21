import { Client, Keypair } from "shelter-sdk";
export declare class DeployedShelter {
    private readonly _steward;
    private readonly _client;
    constructor(_steward: Keypair, _client: Client);
    stewardId(): Promise<string>;
}

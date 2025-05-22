import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";
import type { Keypair } from "shelter-sdk";
import type { Rpc } from "../rpc/rpc.interface";

export class Transaction{
    constructor(
        private readonly _rawTx: AssembledTransaction<any>,
        private readonly _signer: Keypair,
        private readonly _rpc: Rpc
    ){

    }
    async result(){
        
    }
}
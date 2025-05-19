import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}




export type Gate = {tag: "Open", values: void} | {tag: "Guarded", values: void} | {tag: "Sealed", values: void};


export interface Pass {
  public_key: Buffer;
  signature: Buffer;
}


export interface AidDataKey {
  recipient: Buffer;
  token: string;
}


export interface AidValue {
  amount: i128;
  expiration: u64;
}

export type DataKey = {tag: "Aid", values: readonly [AidDataKey]} | {tag: "AssignedAid", values: readonly [string]} | {tag: "Steward", values: void} | {tag: "ReleaseKey", values: void} | {tag: "GateState", values: void};

export const Errors = {
  1: {message:"NotEnoughBalance"},

  2: {message:"InvalidAction"},

  3: {message:"NotEnoughAid"},

  4: {message:"InvalidContext"},

  5: {message:"ExpiredAid"},

  6: {message:"ShelterGuarded"},

  7: {message:"ShelterSealed"}
}

export interface Client {
  /**
   * Construct and simulate a update_release_key transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_release_key: ({steward_key}: {steward_key: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a open transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  open: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a guard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  guard: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a seal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  seal: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a release_key transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  release_key: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Buffer>>

  /**
   * Construct and simulate a steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  steward: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a update_steward transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  update_steward: ({new_steward}: {new_steward: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a bound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  bound_aid: ({recipient, token, amount, expiration}: {recipient: Buffer, token: string, amount: i128, expiration: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a unbound_aid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  unbound_aid: ({recipient, token}: {recipient: Buffer, token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  aid_of: ({recipient, token}: {recipient: Buffer, token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<AidValue>>

  /**
   * Construct and simulate a assigned_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  assigned_aid_of: ({token}: {token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a available_aid_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  available_aid_of: ({token}: {token: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {steward}: {steward: string},
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy({steward}, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAABEdhdGUAAAADAAAAAAAAAAAAAAAET3BlbgAAAAAAAAAAAAAAB0d1YXJkZWQAAAAAAAAAAAAAAAAGU2VhbGVkAAA=",
        "AAAAAQAAAAAAAAAAAAAABFBhc3MAAAACAAAAAAAAAApwdWJsaWNfa2V5AAAAAAPuAAAAIAAAAAAAAAAJc2lnbmF0dXJlAAAAAAAD7gAAAEA=",
        "AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAAB3N0ZXdhcmQAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAASdXBkYXRlX3JlbGVhc2Vfa2V5AAAAAAABAAAAAAAAAAtzdGV3YXJkX2tleQAAAAPuAAAAIAAAAAA=",
        "AAAAAAAAAAAAAAAEb3BlbgAAAAAAAAAA",
        "AAAAAAAAAAAAAAAFZ3VhcmQAAAAAAAAAAAAAAA==",
        "AAAAAAAAAAAAAAAEc2VhbAAAAAAAAAAA",
        "AAAAAAAAAAAAAAALcmVsZWFzZV9rZXkAAAAAAAAAAAEAAAPuAAAAIA==",
        "AAAAAAAAAAAAAAAHc3Rld2FyZAAAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAAOdXBkYXRlX3N0ZXdhcmQAAAAAAAEAAAAAAAAAC25ld19zdGV3YXJkAAAAABMAAAAA",
        "AAAAAAAAAAAAAAAJYm91bmRfYWlkAAAAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAALdW5ib3VuZF9haWQAAAAAAgAAAAAAAAAJcmVjaXBpZW50AAAAAAAD7gAAACAAAAAAAAAABXRva2VuAAAAAAAAEwAAAAA=",
        "AAAAAAAAAAAAAAAGYWlkX29mAAAAAAACAAAAAAAAAAlyZWNpcGllbnQAAAAAAAPuAAAAIAAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAB9AAAAAIQWlkVmFsdWU=",
        "AAAAAAAAAAAAAAAPYXNzaWduZWRfYWlkX29mAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAQYXZhaWxhYmxlX2FpZF9vZgAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAAMX19jaGVja19hdXRoAAAAAwAAAAAAAAARc2lnbmF0dXJlX3BheWxvYWQAAAAAAAPuAAAAIAAAAAAAAAAKc2lnbmF0dXJlcwAAAAAH0AAAAARQYXNzAAAAAAAAAA1hdXRoX2NvbnRleHRzAAAAAAAD6gAAB9AAAAAHQ29udGV4dAAAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAQAAAAAAAAAAAAAACkFpZERhdGFLZXkAAAAAAAIAAAAAAAAACXJlY2lwaWVudAAAAAAAA+4AAAAgAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAQAAAAAAAAAAAAAACEFpZFZhbHVlAAAAAgAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAApleHBpcmF0aW9uAAAAAAAG",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAAA0FpZAAAAAABAAAH0AAAAApBaWREYXRhS2V5AAAAAAABAAAAAAAAAAtBc3NpZ25lZEFpZAAAAAABAAAAEwAAAAAAAAAAAAAAB1N0ZXdhcmQAAAAAAAAAAAAAAAAKUmVsZWFzZUtleQAAAAAAAAAAAAAAAAAJR2F0ZVN0YXRlAAAA",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABwAAAAAAAAAQTm90RW5vdWdoQmFsYW5jZQAAAAEAAAAAAAAADUludmFsaWRBY3Rpb24AAAAAAAACAAAAAAAAAAxOb3RFbm91Z2hBaWQAAAADAAAAAAAAAA5JbnZhbGlkQ29udGV4dAAAAAAABAAAAAAAAAAKRXhwaXJlZEFpZAAAAAAABQAAAAAAAAAOU2hlbHRlckd1YXJkZWQAAAAAAAYAAAAAAAAADVNoZWx0ZXJTZWFsZWQAAAAAAAAH" ]),
      options
    )
  }
  public readonly fromJSON = {
    update_release_key: this.txFromJSON<null>,
        open: this.txFromJSON<null>,
        guard: this.txFromJSON<null>,
        seal: this.txFromJSON<null>,
        release_key: this.txFromJSON<Buffer>,
        steward: this.txFromJSON<string>,
        update_steward: this.txFromJSON<null>,
        bound_aid: this.txFromJSON<null>,
        unbound_aid: this.txFromJSON<null>,
        aid_of: this.txFromJSON<AidValue>,
        assigned_aid_of: this.txFromJSON<i128>,
        available_aid_of: this.txFromJSON<i128>
  }
}
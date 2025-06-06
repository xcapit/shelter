// TODO:
// import { Hex } from "viem";
// import { UserOperation } from "../user-operation/user-operation";

export interface SmartAccount {
  address(): Promise<string>;
  ownerAddress(): Promise<string>;
  // TODO:
  // ownerPrivateKey(): Promise<Hex>;
  // send(userOperations: UserOperation[]): Promise<string>;
  // transactionHashOf(aUserOperationHash: string): Promise<Hex>;
  ownerPrivateKey(): Promise<any>;
  send(userOperations: any[]): Promise<string>;
  transactionHashOf(aUserOperationHash: string): Promise<any>;
}

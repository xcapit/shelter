// TODO:
// import { Hex } from "viem";
// import { UserOperation } from "../../user-operation/user-operation";
// import { SmartAccount } from "../smart-account";
//
// export class FakeSmartAccount implements SmartAccount {
//   constructor(
//     private _anAddressReturn: string = "",
//     private _anOwnerAddressReturn: string = "",
//     private _anOwnerPrivateKey: string = "",
//     private _failedSend: boolean = false
//   ) {}
//
//   transactionHashOf(aUserOperationHash: string): Promise<Hex> {
//     return Promise.resolve("0x" as Hex);
//   }
//
//   send(userOperations: UserOperation[]): Promise<string> {
//     if (this._failedSend) {
//       throw new Error("Send error");
//     }
//     return Promise.resolve("");
//   }
//
//   async ownerPrivateKey(): Promise<Hex> {
//     return this._anOwnerPrivateKey as Hex;
//   }
//
//   async ownerAddress(): Promise<string> {
//     return this._anOwnerAddressReturn;
//   }
//
//   address(): Promise<string> {
//     return Promise.resolve(this._anAddressReturn);
//   }
// }

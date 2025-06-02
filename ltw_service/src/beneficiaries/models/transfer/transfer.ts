// TODO:
// import { SmartAccount } from "../smart-account/smart-account";
// import { Token } from "../token/token.interface";
// import { TransferTransaction } from "../transfer-transaction/transfer-transaction";
// import { UserOperation } from "../user-operation/user-operation";
// import { WeiOf } from "../wei-of/wei-of";

// export class Transfer {
//   constructor(
//     private _aSmartAccount: SmartAccount,
//     private _aToken: Token,
//     private _anAmount: string,
//     private _to: string
//   ) {}

//   async txHash() {
//     return await this._aSmartAccount.transactionHashOf(
//       await this._aSmartAccount.send([
//         new UserOperation(
//           new TransferTransaction(
//             this._aToken,
//             this._to,
//             new WeiOf(this._anAmount, this._aToken).value()
//           )
//         ),
//       ])
//     );
//   }
// }
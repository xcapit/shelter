// TODO:
// import { Hex, encodeFunctionData } from "viem";
// import { Token } from "../token/token.interface";

// export class TransferTransaction {
//   constructor(
//     private _aToken: Token,
//     private _to: string,
//     private _aWeiAmount: bigint
//   ) {}

//   toHex(): Hex {
//     return encodeFunctionData({
//       abi: this._aToken.abi(),
//       functionName: "transfer",
//       args: [this._to, this._aWeiAmount],
//     });
//   }

//   tokenAddress(): string {
//     return this._aToken.address();
//   }
// }
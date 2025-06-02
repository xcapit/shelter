// TODO:
// import { createPublicClient, Hex, http } from 'viem';
// import { AmountOf } from '../../beneficiaries/models/amount-of/amount-of';
// import { Token } from '../../beneficiaries/models/token/token.interface';
// import { Blockchain } from '../../beneficiaries/models/blockchain/blockchain';
// import dotenv from "dotenv";
// import process from "process";
//
// dotenv.config();
//
//
// const { ALCHEMY_RPC } = process.env;
//
// export class BalanceOf {
//
//   constructor(
//     private _aToken: Token,
//     private _anAddress: string,
//     private _alchemyPublicClient: any = createPublicClient({
//       chain: new Blockchain().value(),
//       transport: http(ALCHEMY_RPC),
//     }),
//   ) {}
//
//   async toAmount(): Promise<AmountOf> {
//     return new AmountOf(
//       await this._alchemyPublicClient.readContract({
//         address: this._aToken.address(),
//         abi: this._aToken.abi(),
//         functionName: 'balanceOf',
//         args: [this._anAddress as Hex],
//       }),
//       this._aToken,
//     );
//   }
//
//   async toJson() {
//     return {
//       balance: (await this.toAmount()).value(),
//       token: this._aToken.symbol()
//     };
//   }
// }

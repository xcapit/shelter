// TODO
// import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
// import { createPublicClient, http } from "viem";
// import dotenv from "dotenv";
// import process from "process";
// import { BalanceOf } from "../../../../shared/balance-of/balance-of";
// import { Tokens } from "../../../../beneficiaries/models/tokens/tokens";
// import { AmountOf } from "../../../../beneficiaries/models/amount-of/amount-of";
// import { Command } from "../command.interface";
// import { Blockchain } from "../../../../beneficiaries/models/blockchain/blockchain";
// import {TranslatedKey} from "../../../../system/multi-language/translated-key/translated-key";

// dotenv.config();

// const { ALCHEMY_RPC } = process.env;

// export class BalanceCmd implements Command {
//   private _balanceAmount: AmountOf;

//   constructor(
//     private _params: string[],
//     private _aPhoneNumber: string,
//     private _beneficiaries: Beneficiaries,
//     private _aPublicClient: any = createPublicClient({
//       chain: new Blockchain().value(),
//       transport: http(ALCHEMY_RPC),
//     })
//   ) {}

//   destinationNumber(): string {
//     return this._aPhoneNumber;
//   }

//   private async _execute(): Promise<void> {
//     this._balanceAmount = await new BalanceOf(
//       await new Tokens().oneBy(this._params[0]),
//       (await this._beneficiaries.findOneBy(this.destinationNumber())).address(),
//       this._aPublicClient
//     ).toAmount();
//   }

//   async bodyResponse(): Promise<string> {
//     let result = new TranslatedKey('balanceError').toString();
//     try {
//       await this._execute();
//       result = `${new TranslatedKey('balanceResponse')} ${this._balanceAmount.value()} ${this._params[0]}`;
//     } catch (error: any) {
//       console.log("Balance Command Error: ", error);
//     }
//     return result;
//   }
// }

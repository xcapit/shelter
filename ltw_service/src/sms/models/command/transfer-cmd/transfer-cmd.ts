// TODO:
// import { createPublicClient, http } from 'viem';
// import { AmountOf } from '../../../../beneficiaries/models/amount-of/amount-of';
// import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
// import { SmartAccount } from '../../../../beneficiaries/models/smart-account/smart-account';
// import { Tokens } from '../../../../beneficiaries/models/tokens/tokens';
// import { Transfer } from '../../../../beneficiaries/models/transfer/transfer';
// import { BalanceOf } from '../../../../shared/balance-of/balance-of';
// import { TranslatedKey } from '../../../../system/multi-language/translated-key/translated-key';
// import { Command } from '../command.interface';
// import { Blockchain } from '../../../../beneficiaries/models/blockchain/blockchain';
// import dotenv from 'dotenv';
// import { Token } from '../../../../beneficiaries/models/token/token.interface';
//
// dotenv.config();
//
// const { ALCHEMY_RPC } = process.env;
//
// export class TransferCmd implements Command {
//   private _txHash: string;
//   private _balanceAmount: AmountOf;
//   private _token: Token
//
//   constructor(
//     private _phoneNumber: string,
//     private _params: string[],
//     private _aSmartAccount: SmartAccount,
//     private _beneficiaries: Beneficiaries,
//     private _aPublicClient: any = createPublicClient({
//       chain: new Blockchain().value(),
//       transport: http(ALCHEMY_RPC),
//     }),
//   ) {}
//
//   destinationNumber(): string {
//     return this._phoneNumber;
//   }
//
//   private async _execute(): Promise<void> {
//     this._token = await new Tokens().oneBy(this._params[0])
//     this._txHash = await new Transfer(
//       this._aSmartAccount,
//       this._token,
//       this._params[1],
//       this._params[2],
//     ).txHash();
//     await this._getBalanceAfterTx();
//   }
//
//   private async _getBalanceAfterTx(): Promise<void> {
//     this._balanceAmount = await new BalanceOf(
//       this._token,
//       (await this._beneficiaries.findOneBy(this.destinationNumber())).address(),
//       this._aPublicClient,
//     ).toAmount();
//   }
//
//   async bodyResponse(): Promise<string> {
//     let result = new TranslatedKey('transferError').toString();
//     try {
//       await this._execute();
//       result = new TranslatedKey('transferResponse', {
//         aTxHash: this._txHash,
//         aBalanceAmount: this._balanceAmount.value().toFixed(2),
//         aToken: this._token.symbol()
//       }).toString();
//     } catch (error: any) {
//       console.log('Transfer Command Error: ', error);
//     }
//     return result;
//   }
// }

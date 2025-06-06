// TODO:
// import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
// import { SmartAccount } from '../../../../beneficiaries/models/smart-account/smart-account';
// import { Tokens } from '../../../../beneficiaries/models/tokens/tokens';
// import { KotaniPayProvider } from '../../../../off-ramp/models/off-ramp-providers/kotanipay-provider/kotanipay-provider';
// import { OffRampService } from '../../../../off-ramp/models/off-ramp-service/off-ramp-service';
// import { TranslatedKey } from '../../../../system/multi-language/translated-key/translated-key';
// import { Command } from '../command.interface';

// export class OffRampCmd implements Command {
//   constructor(
//     private _phoneNumber: string,
//     private _params: string[],
//     private _beneficiaries: Beneficiaries,
//     private _smartAccount: SmartAccount,
//   ) {}

//   private async _execute(): Promise<string> {
//     return await new OffRampService(
//       new KotaniPayProvider(
//         parseInt(this._params[0], 10),
//         await new Tokens().oneBy(this._params[1]),
//         this._params[2],
//         await this._beneficiaries.ensurePhoneInfo(await this._beneficiaries.findOneBy(this.destinationNumber())),
//         this._smartAccount,
//       ),
//     ).process();
//   }

//   async bodyResponse(): Promise<string> {
//     let result = new TranslatedKey('offRampError').toString();
//     try {
//       result = `${new TranslatedKey('offRampResponse', {
//         anAmount: await this._execute(),
//         aCurrencySymbol: this._params[2],
//       })}`;
//     } catch (error: any) {
//       console.log('Offramp Command Error: ', error);
//     }
//     return result;
//   }

//   destinationNumber(): string {
//     return this._phoneNumber;
//   }
// }

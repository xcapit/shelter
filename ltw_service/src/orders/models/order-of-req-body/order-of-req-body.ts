// TODO:
// import { Beneficiary } from '../../../beneficiaries/models/beneficiary/beneficiary.interface';
// import { number, object, string } from 'yup';
// import { Beneficiaries } from '../../../beneficiaries/models/beneficiaries/beneficiaries';
// import { Tokens } from '../../../beneficiaries/models/tokens/tokens';
// import { OTP } from '../../../beneficiaries/models/otp/otp';
// import { TTL } from '../../../beneficiaries/models/ttl/ttl';
// import { Address } from '../../../beneficiaries/models/address/address';
// import { Token } from '../../../beneficiaries/models/token/token.interface';
// import { OTPSendMsg } from '../messages/otp-send-msg/otp-send-msg';

// export class OrderOfReqBody {
//   private _cachedToken: Token;
//   private _cachedBeneficiary: Beneficiary;
//   private _rules = object({
//     amount: number().required().moreThan(0),
//     token: string().required(),
//     phoneNumber: string().required(),
//     merchAddress: string().required(),
//     description: string().optional(),
//   });

//   constructor(
//     private _aRequestBody: any,
//     private _beneficiaries: Beneficiaries,
//     private _tokens: Tokens,
//     private _otp: OTP = new OTP(),
//     private _ttl: TTL = new TTL(),
//   ) {
//     this._rules.validateSync({
//       amount: this._aRequestBody.amount,
//       token: this._aRequestBody.token,
//       phoneNumber: this._aRequestBody.phoneNumber,
//       merchAddress: this._aRequestBody.merchAddress,
//       description: this._aRequestBody.description,
//     });
//   }

//   public async toJson() {
//     return {
//       description: this._aRequestBody.description,
//       amount: this._aRequestBody.amount,
//       token: (await this._token()).symbol(),
//       phoneNumber: (await this._beneficiary()).phoneNumber(),
//       merchAddress: new Address(this._aRequestBody.merchAddress).toString(),
//       otp: this._otp.value(),
//       expirationDate: this._ttl.expirationDate(),
//     };
//   }

//   public async otpMsg(): Promise<string> {
//     return new OTPSendMsg(
//       this._otp,
//       this._aRequestBody.amount,
//       await this._token(),
//     ).toString();
//   }

//   public async beneficiaryPhoneNumber() {
//     return (await this._beneficiary()).phoneNumber();
//   }

//   public async toSecureJson(): Promise<any> {
//     let secureJson = (await this.toJson()) as {
//       otp?: string;
//     };
//     delete secureJson.otp;
//     return secureJson;
//   }

//   private async _beneficiary(): Promise<Beneficiary> {
//     if (!this._cachedBeneficiary) {
//       this._cachedBeneficiary = await this._beneficiaries.findOneBy(
//         this._aRequestBody.phoneNumber,
//       );
//     }
//     return this._cachedBeneficiary;
//   }

//   private async _token(): Promise<Token> {
//     if (!this._cachedToken) {
//       this._cachedToken = await this._tokens.oneBy(this._aRequestBody.token);
//     }
//     return this._cachedToken;
//   }
// }

// TODO:
// import { Beneficiary } from '../../../../beneficiaries/models/beneficiary/beneficiary.interface';
// import { SmartAccount } from '../../../../beneficiaries/models/smart-account/smart-account';
// import { Token } from '../../../../beneficiaries/models/token/token.interface';
// import { Transfer } from '../../../../beneficiaries/models/transfer/transfer';
// import { Provider } from '../provider.interface';
// import dotenv from 'dotenv';
// import process from 'process';
// import createDebug from 'debug';

// const debug = createDebug('app:kotanipay-provider');
// dotenv.config();

// const { PRODUCTION, KOTANIPAY_API_KEY, KOTANIPAY_API_URL, CURRENT_BLOCKCHAIN } =
//   process.env;

// export class KotaniPayProvider implements Provider {
//   constructor(
//     private _amount: number,
//     private _token: Token,
//     private _currency: string,
//     private _beneficiary: Beneficiary,
//     private _smartAccount: SmartAccount,
//     private _debug = PRODUCTION === '0',
//   ) {}

//   private _createOffRampRequestBody(): string {
//     return JSON.stringify({
//       mobileMoneyReceiver: {
//         phoneNumber: this._beneficiary.phoneNumber(),
//         accountName: this._beneficiary.phoneNumber(),
//         networkProvider: this._debug ? 'MTN' : this._beneficiary.networkProvider(),
//       },
//       cryptoAmount: this._amount,
//       currency: this._currency,
//       chain: this._debug ? 'POLYGON' : CURRENT_BLOCKCHAIN?.toUpperCase(),
//       token: this._token.symbol(),
//       referenceId: `${this._beneficiary.phoneNumber()}-${Date.now()}`,
//       senderAddress: this._beneficiary.address(),
//       callbackUrl: '',
//     });
//   }

//   private async _createMobileMoneyCustomerRequest(): Promise<void> {
//     const response = await fetch(`${KOTANIPAY_API_URL}/customer/mobile-money`, {
//       method: 'POST',
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json',
//         authorization: `Bearer ${KOTANIPAY_API_KEY}`
//       },
//       body: JSON.stringify({
//         phone_number: this._beneficiary.phoneNumber(),
//         account_name: this._beneficiary.phoneNumber(),
//         network: this._debug ? 'MTN' : this._beneficiary.networkProvider(),
//         country_code: this._debug ? 'GHA' : this._beneficiary.countryCode(),
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(
//         `Create Mobile Money Customer request failed: ${response.status} ${response.statusText} ${await response.text()}`,
//       );
//     }
//   }

//   private async _sendOffRampRequest(requestBody: string): Promise<Response> {
//     return fetch(`${KOTANIPAY_API_URL}/offramp`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${KOTANIPAY_API_KEY}`,
//       },
//       body: requestBody,
//     });
//   }

//   private async _parseResponse(response: Response): Promise<any> {
//     if (!response.ok) {
//       throw new Error(
//         `Off-ramp request failed: ${response.status} ${response.statusText} ${await response.text()}`,
//       );
//     }
//     return response.json();
//   }

//   private async _sendTokenToEscrow(offRampResponse: any): Promise<string> {
//     return new Transfer(
//       this._smartAccount,
//       this._token,
//       this._amount.toString(),
//       offRampResponse.data.escrowAddress,
//     ).txHash();
//   }

//   amount(): number {
//     return this._amount;
//   }

//   token(): Token {
//     return this._token;
//   }

//   currency(): string {
//     return this._currency;
//   }

//   beneficiary(): Beneficiary {
//     return this._beneficiary;
//   }

//   async execute(): Promise<any> {
//     debug('🔁 Starting full execution process');

//     debug('📞 Creating mobile money customer request');
//     const createCustomerStart = Date.now();
//     await this._createMobileMoneyCustomerRequest();
//     debug(`✅ Created customer request in ${Date.now() - createCustomerStart}ms`);

//     debug('📤 Creating offramp customer request');
//     const offRampResponseStart = Date.now();
//     const offRampResponse = await this._parseResponse(
//       await this._sendOffRampRequest(this._createOffRampRequestBody()),
//     );
//     debug(`✅ Created offramp request in ${Date.now() - offRampResponseStart}ms`);

//     debug('🔗 Sending tokens to escrow operation');
//     const _sendTokenToEscrowStart = Date.now();
//     let txHash = await this._sendTokenToEscrow(offRampResponse)
//     debug(`✅ Sent token to escrow in ${Date.now() - _sendTokenToEscrowStart}ms`);
//     debug(`📓 Send token to escrow txHash: `, txHash)

//     return {
//       phoneNumber: this._beneficiary.phoneNumber(),
//       txHash: txHash,
//       provider: 'KotaniPay',
//       cryptoAmount: offRampResponse.data.cryptoAmount,
//       fiatConversionAmount: offRampResponse.data.fiatAmount,
//       fiatTxAmount: offRampResponse.data.fiatTransactionAmount,
//       fiatCurrency: offRampResponse.data.fiatCurrency,
//       token: offRampResponse.data.rate.from,
//       fee: offRampResponse.data.rate.fee,
//       txReferenceId: offRampResponse.data.referenceId,
//     }
//   }
// }

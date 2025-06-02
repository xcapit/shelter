import { Beneficiary } from '../beneficiary/beneficiary.interface';
import { DefaultBeneficiary } from '../beneficiary/default-beneficiary/default-beneficiary';
import { NullBeneficiary } from '../beneficiary/null-beneficiary/null-beneficiary';
import { DefaultBeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo';
import { BeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/beneficiaries-data-repo.interface';
// TODO
import { SmartAccount } from '../smart-account/smart-account';
import { PrivateKeySharding } from '../private-key/private-key-sharding/private-key-sharding';
import { PhoneNumber } from '../../../shared/phone-number-info/phone-number';
import twilio from 'twilio';
import dotenv from 'dotenv';
import process from 'process';
import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';
import { SponsoredAccount } from '../sponsored-account/sponsored-account';

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

// TODO
// export class Beneficiaries {
//   constructor(
//     private _aDataRepo: BeneficiariesDataRepo = new DefaultBeneficiariesDataRepo(),
//     private _client: twilio.Twilio | FakeTwilio = twilio(
//       TWILIO_ACCOUNT_SID,
//       TWILIO_AUTH_TOKEN,
//     ),
//     private _privateKeySharding = new PrivateKeySharding(),
//   ) {}
//
//   async save(
//     rawBeneficiaryData: any,
//     aSmartAccount: SmartAccount,
//   ): Promise<void> {
//     await this._aDataRepo.save({
//       phoneNumber: await new PhoneNumber(
//         rawBeneficiaryData.phoneNumber,
//         this._client,
//       ).value(),
//       address: await aSmartAccount.address(),
//       ownerAddress: await aSmartAccount.ownerAddress(),
//       ownerSecrets: await this._privateKeySharding.split(
//         await aSmartAccount.ownerPrivateKey(),
//       ),
//     });
//   }
//
//   async findOneBy(aPhoneNumber: string): Promise<Beneficiary> {
//     const rawBeneficiaryData = await this._aDataRepo.findOneBy(aPhoneNumber);
//     return rawBeneficiaryData
//       ? new DefaultBeneficiary(rawBeneficiaryData)
//       : new NullBeneficiary();
//   }
//
//   async findPrivateKeyBy(aPhoneNumber: string): Promise<string> {
//     return await this._privateKeySharding.combine(
//       (await this._aDataRepo.findSecretsBy(aPhoneNumber)).ownerSecrets,
//     );
//   }
//
//   async updatePhoneNumber(
//     beneficiary: Beneficiary,
//     aPhoneNumber: string,
//   ): Promise<any> {
//     return this._aDataRepo.updatePhoneNumber(beneficiary, aPhoneNumber);
//   }
//
//   async ensurePhoneInfo(beneficiary: Beneficiary): Promise<Beneficiary> {
//     if (beneficiary.countryCode() && beneficiary.networkProvider()) {
//       return beneficiary;
//     }
//     const phoneNumber = new PhoneNumber(
//       beneficiary.phoneNumber(),
//       this._client,
//       beneficiary.countryCode(),
//       beneficiary.networkProvider(),
//     );
//     return new DefaultBeneficiary(
//       await this._aDataRepo.update(beneficiary, {
//         countryCode: await phoneNumber.countryCode(),
//         networkProvider: await phoneNumber.networkProvider(),
//       }),
//     );
//   }
//
//   async deactivate(aBeneficiary: Beneficiary): Promise<any> {
//     return this._aDataRepo.update(aBeneficiary, { active: false });
//   }
// }
//
export class Beneficiaries {
  constructor(
    private _aDataRepo: BeneficiariesDataRepo = new DefaultBeneficiariesDataRepo(),
    private _client: twilio.Twilio | FakeTwilio = twilio(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
    ),
  ) { }

  async save(
    rawBeneficiaryData: any,
    sponsoredAccount: SponsoredAccount,
  ): Promise<void> {
    await this._aDataRepo.save({
      phoneNumber: await new PhoneNumber(
        rawBeneficiaryData.phoneNumber,
        this._client,
      ).value(),
      address: await sponsoredAccount.address(),
      secret: await sponsoredAccount.secret(),
    });
  }

  async findOneBy(aPhoneNumber: string): Promise<Beneficiary> {
    const rawBeneficiaryData = await this._aDataRepo.findOneBy(aPhoneNumber);
    return rawBeneficiaryData
      ? new DefaultBeneficiary(rawBeneficiaryData)
      : new NullBeneficiary();
  }
}

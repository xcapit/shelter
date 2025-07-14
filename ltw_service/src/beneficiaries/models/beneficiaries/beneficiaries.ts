import { Beneficiary } from '../beneficiary/beneficiary.interface';
import { DefaultBeneficiary } from '../beneficiary/default-beneficiary/default-beneficiary';
import { NullBeneficiary } from '../beneficiary/null-beneficiary/null-beneficiary';
import { DefaultBeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo';
import { BeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/beneficiaries-data-repo.interface';
import { PhoneNumber } from '../../../shared/phone-number-info/phone-number';
import twilio from 'twilio';
import dotenv from 'dotenv';
import process from 'process';
import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';
import { SponsoredAccount } from '../sponsored-account/sponsored-account';

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

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

  async findPrivateKeyBy(aPhoneNumber: string): Promise<string> {
    return (await this._aDataRepo.findSecretBy(aPhoneNumber)).secret;
  }

  async updatePhoneNumber(
    beneficiary: Beneficiary,
    aPhoneNumber: string,
  ): Promise<any> {
    return this._aDataRepo.updatePhoneNumber(beneficiary, aPhoneNumber);
  }

  async deactivate(aBeneficiary: Beneficiary): Promise<any> {
    return this._aDataRepo.update(aBeneficiary, { active: false });
  }
}

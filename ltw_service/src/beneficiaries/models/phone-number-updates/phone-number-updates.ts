import { DefaultPhoneNumberUpdatesDataRepo } from "../data-repo/phone-number-updates-data-repo/default/default-phone-number-updates-data-repo";
import { PhoneNumberUpdatesDataRepo } from "../data-repo/phone-number-updates-data-repo/phone-number-updates-data-repo.interface";
import { DefaultPhoneNumberUpdate } from "../phone-number-update/default-phone-number-update/default-phone-number-update";
import { OTP } from "../otp/otp";
import { PhoneNumberUpdate } from "../phone-number-update/phone-number-update.interface";
import { NullPhoneNumberUpdate } from "../phone-number-update/null-phone-number-update/null-phone-number-update";
import twilio from 'twilio';
import dotenv from 'dotenv';
import process from 'process';
import { FakeTwilio } from "../../../sms/models/fake-twilio/fake-twilio";
import { PhoneNumber } from "../../../shared/phone-number-info/phone-number";

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
export class PhoneNumberUpdates {
  constructor(
    private _aDataRepo: PhoneNumberUpdatesDataRepo = new DefaultPhoneNumberUpdatesDataRepo(),
    private _client: twilio.Twilio | FakeTwilio = twilio(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN,
      ),
  ) {}

  async save(
    anOTP: OTP,
    anActualPhoneNumber: string,
    aNewPhoneNumber: string
  ): Promise<void> {
    const aVerifiedNewPhoneNumber = await new PhoneNumber(aNewPhoneNumber, this._client).value();
    this._aDataRepo.save({
      otp: anOTP.value(),
      actualPhoneNumber: anActualPhoneNumber,
      newPhoneNumber: aVerifiedNewPhoneNumber,
    });
  }

  async findOneBy(
    anOTP: string,
    aPhoneNumber: string
  ): Promise<PhoneNumberUpdate> {
    const rawPhoneNumberUpdate = await this._aDataRepo.findOneBy(
      anOTP,
      aPhoneNumber
    );
    return rawPhoneNumberUpdate
      ? new DefaultPhoneNumberUpdate(rawPhoneNumberUpdate)
      : new NullPhoneNumberUpdate();
  }

  async clearOtp(aPhoneNumberUpdate: PhoneNumberUpdate): Promise<any> {
    return this._aDataRepo.update(aPhoneNumberUpdate, { otp: null });
  }
}

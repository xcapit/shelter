import { FakeTwilio } from '../../sms/models/fake-twilio/fake-twilio';
import twilio from 'twilio';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

export class PhoneNumber {
  private _valid?: boolean;
  private _validPhoneNumber: string;
  private _cachedNetworkProvider: string;
  private _cachedCountryCode: string;

  constructor(
    private _phoneNumber: string,
    private _client: twilio.Twilio | FakeTwilio = twilio(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
    ),
    private _countryCode?: string,
    private _networkProvider?: string,
  ) {}

  private async _ensureValidity(): Promise<void> {
    if (this._valid === undefined) {
      const result = await this._client.lookups.v2
        .phoneNumbers(this._phoneNumber)
        .fetch();
      if (!result || result.valid === false) {
        throw new Error('Phone number format is not valid');
      }
      this._valid = result.valid;
      this._validPhoneNumber = result.phoneNumber;
    }
  }

  async value(): Promise<string> {
    await this._ensureValidity();
    return this._validPhoneNumber;
  }


  private async _fetchInfoValues(): Promise<void> {
    try {
      const numberInfo = await this._client.lookups.v2
        .phoneNumbers(this._phoneNumber)
        .fetch({ fields: 'line_type_intelligence' });
      this._cachedNetworkProvider =
        numberInfo.lineTypeIntelligence.carrier_name || 'Unknown';
      this._cachedCountryCode = numberInfo.countryCode || 'Unknown';
    } catch (error) {
      throw new Error('Failed to fetch phone information');
    }
  }

  async networkProvider(): Promise<string> {
    if (!this._networkProvider && !this._cachedNetworkProvider) {
      await this._fetchInfoValues();
    } else if (!this._cachedNetworkProvider) {
      this._cachedNetworkProvider = this._networkProvider ?? 'Unknown';
    }
    return this._cachedNetworkProvider;
  }

  async countryCode(): Promise<string> {
    if (!this._countryCode && !this._cachedCountryCode) {
      await this._fetchInfoValues();
    } else if (!this._cachedCountryCode) {
      this._cachedCountryCode = this._countryCode ?? 'Unknown';
    }
    return this._cachedCountryCode;
  }
}

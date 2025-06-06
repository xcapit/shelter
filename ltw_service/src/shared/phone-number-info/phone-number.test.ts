import { FakeTwilio } from '../../sms/models/fake-twilio/fake-twilio';
import { PhoneNumber } from './phone-number';

describe('Phone Number', () => {
  let phoneNumber: PhoneNumber;
  let aPhoneNumber = '+549123456789';
  const countryCode = 'US';
  const lineTypeIntelligence = { carrier_name: 'AT&T' };

  beforeEach(() => {
    phoneNumber = new PhoneNumber(
      aPhoneNumber,
      new FakeTwilio(countryCode, lineTypeIntelligence, true),
      countryCode,
      lineTypeIntelligence.carrier_name,
    );
  });

  test('should instantiate PhoneNumber', () => {
    expect(phoneNumber).toBeTruthy();
    expect(new PhoneNumber(aPhoneNumber, new FakeTwilio(undefined, undefined, true))).toBeTruthy();
    expect(new PhoneNumber(
      aPhoneNumber,
      new FakeTwilio(countryCode, lineTypeIntelligence, true),
      countryCode,
      lineTypeIntelligence.carrier_name
    )).toBeTruthy();
  });

  test('should get phone info successfully', async () => {
    expect(await phoneNumber.value()).toEqual(aPhoneNumber);
    expect(await phoneNumber.countryCode()).toEqual(countryCode);
    expect(await phoneNumber.networkProvider()).toEqual(
      lineTypeIntelligence.carrier_name,
    );
  });

  test('should fetch phone info successfully', async () => {
    phoneNumber = new PhoneNumber(
      aPhoneNumber,
      new FakeTwilio(countryCode, lineTypeIntelligence, true),
      undefined,
      undefined,
    );
    expect(await phoneNumber.value()).toEqual(aPhoneNumber);
    expect(await phoneNumber.countryCode()).toEqual(countryCode);
    expect(await phoneNumber.networkProvider()).toEqual(
      lineTypeIntelligence.carrier_name,
    );
  });

  test('should throw error when phone number format is not valid', async () => {
    phoneNumber = new PhoneNumber(
      '+999',
      new FakeTwilio(countryCode, lineTypeIntelligence, false),
      undefined,
      undefined,
    );
    await expect(phoneNumber.value()).rejects.toThrow(
      'Phone number format is not valid',
    );
  });
});

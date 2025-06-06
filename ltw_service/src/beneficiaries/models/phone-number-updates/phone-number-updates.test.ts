import { FakePhoneNumberUpdatesDataRepo } from '../data-repo/phone-number-updates-data-repo/fake/fake-phone-number-updates-data-repo';
import { rawPhoneNumberUpdate } from '../../../fixtures/raw-phone-number-update-data';
import { OTP } from '../otp/otp';
import { PhoneNumberUpdates } from './phone-number-updates';
import { DefaultPhoneNumberUpdate } from '../phone-number-update/default-phone-number-update/default-phone-number-update';
import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';

describe('PhoneNumberUpdates', () => {
  let phoneNumberUpdates: PhoneNumberUpdates;

  beforeEach(() => {
    phoneNumberUpdates = new PhoneNumberUpdates(
      new FakePhoneNumberUpdatesDataRepo(rawPhoneNumberUpdate),
      new FakeTwilio(),
    );
  });

  test('new', () => {
    expect(phoneNumberUpdates).not.toBeNull();
  });

  test('save', async () => {
    expect(
      await phoneNumberUpdates.save(
        new OTP(),
        'anActualPhoneNumber',
        'aNewPhoneNumber',
      ),
    ).toBeUndefined();
  });

  test('findOneBy', async () => {
    expect(
      (
        await phoneNumberUpdates.findOneBy('anOTP', 'phoneNumber')
      ).newPhoneNumber(),
    ).toEqual(rawPhoneNumberUpdate.newPhoneNumber);
  });

  test('clearOtp', async () => {
    expect(
      await phoneNumberUpdates.clearOtp(
        new DefaultPhoneNumberUpdate(rawPhoneNumberUpdate),
      ),
    ).toBeTruthy();
  });
});

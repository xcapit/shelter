import { Stellar } from '@stellar/typescript-wallet-sdk';
import { rawBeneficiaryData } from '../../../fixtures/raw-beneficiary-data';
import { SigningKeypair } from '../../../shared/account-keypair/account-keypair';
import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';
import { FakeBeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
import { FakeStellar } from '../fake-stellar/fake-stellar';
import { Sponsor } from '../sponsor/sponsor';
import { Beneficiaries } from './beneficiaries';
import { Keypair } from '@stellar/stellar-sdk';

describe('Beneficiaries', () => {
  let beneficiaries: Beneficiaries;

  beforeEach(() => {
    beneficiaries = new Beneficiaries(
      new FakeBeneficiariesDataRepo(),
      new FakeTwilio(
        rawBeneficiaryData.countryCode,
        { carrier_name: rawBeneficiaryData.networkProvider },
        true,
      ),
    );
  });

  test('new', () => {
    expect(beneficiaries).not.toBeNull();
  });

  test('save', async () => {
    expect(
      await beneficiaries.save(
        rawBeneficiaryData,
        await new Sponsor(
          SigningKeypair.fromSecret(Keypair.random().secret()),
          new FakeStellar(true) as unknown as Stellar,
        ).createAccount(),
      ),
    ).toBeUndefined();
  });

  test('findOneBy', async () => {
    const aBeneficiary = await beneficiaries.findOneBy(
      rawBeneficiaryData.phoneNumber,
    );

    expect(aBeneficiary).toBeTruthy();
  });

  test('findOneBy null beneficiary', async () => {
    const beneficiaries = new Beneficiaries(
      new FakeBeneficiariesDataRepo(null),
      new FakeTwilio(),
    );
    const aBeneficiary = await beneficiaries.findOneBy(
      rawBeneficiaryData.phoneNumber,
    );

    expect(() => aBeneficiary.address()).toThrow();
  });

  test('findPrivateKeyBy', async () => {
    expect(
      await beneficiaries.findPrivateKeyBy(rawBeneficiaryData.phoneNumber),
    ).toEqual(rawBeneficiaryData.secret);
  });
});

// TODO:
// import {
//   rawBeneficiaryData,
//   rawBeneficiaryPartialData,
// } from '../../../fixtures/raw-beneficiary-data';
// import {
//   ownerAddress,
//   smartAccountAddress,
// } from '../../../fixtures/raw-wallet-data';
// import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';
// import { DefaultBeneficiary } from '../beneficiary/default-beneficiary/default-beneficiary';
// import { FakeBeneficiariesDataRepo } from '../data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
// import { FakeSmartAccount } from '../smart-account/fake-smart-account/fake-smart-account';
// import { Beneficiaries } from './beneficiaries';
//
// describe('Beneficiaries', () => {
//   let beneficiaries: Beneficiaries;
//
//   beforeEach(() => {
//     beneficiaries = new Beneficiaries(
//       new FakeBeneficiariesDataRepo(),
//       new FakeTwilio(
//         rawBeneficiaryData.countryCode,
//         { carrier_name: rawBeneficiaryData.networkProvider },
//         true
//       ),
//     );
//   });
//
//   test('new', () => {
//     expect(beneficiaries).not.toBeNull();
//   });
//
//   test('save', async () => {
//     expect(
//       await beneficiaries.save(
//         rawBeneficiaryData,
//         new FakeSmartAccount(smartAccountAddress, ownerAddress, 'aPrivateKey'),
//       ),
//     ).toBeUndefined();
//   });
//
//   test('findOneBy', async () => {
//     const aBeneficiary = await beneficiaries.findOneBy(
//       rawBeneficiaryData.phoneNumber,
//     );
//
//     expect(aBeneficiary).toBeTruthy();
//   });
//
//   test('findOneBy null beneficiary', async () => {
//     const beneficiaries = new Beneficiaries(
//       new FakeBeneficiariesDataRepo(null),
//       new FakeTwilio()
//     );
//     const aBeneficiary = await beneficiaries.findOneBy(
//       rawBeneficiaryData.phoneNumber,
//     );
//
//     expect(() => aBeneficiary.address()).toThrow();
//   });
//
//   test('findPrivateKeyBy', async () => {
//     expect(
//       await beneficiaries.findPrivateKeyBy(rawBeneficiaryData.phoneNumber),
//     ).toEqual(rawBeneficiaryData.ownerPrivateKey);
//   });
//
//   test('updatePhoneNumber', async () => {
//     const result = await beneficiaries.updatePhoneNumber(
//       new DefaultBeneficiary(rawBeneficiaryData),
//       'aNewPhoneNumber',
//     );
//
//     expect(result).toEqual(
//       expect.objectContaining({
//         phoneNumber: 'aNewPhoneNumber',
//         countryCode: undefined,
//         networkProvider: undefined,
//       })
//     );
//   });
//
//   test('ensurePhoneInfo with all info', async () => {
//     expect(
//       await beneficiaries.ensurePhoneInfo(
//         new DefaultBeneficiary(rawBeneficiaryData),
//       ),
//     ).toBeTruthy();
//   });
//
//   test('ensurePhoneInfo without all info', async () => {
//     const beneficiary = await beneficiaries.ensurePhoneInfo(
//       new DefaultBeneficiary(rawBeneficiaryPartialData),
//     );
//
//     expect(beneficiary.countryCode()).toEqual(rawBeneficiaryData.countryCode);
//     expect(beneficiary.networkProvider()).toEqual(
//       rawBeneficiaryData.networkProvider,
//     );
//   });
//
//   test('deactivate', async () => {
//     expect(
//       await beneficiaries.deactivate(
//         new DefaultBeneficiary(rawBeneficiaryData),
//       ),
//     ).toBeTruthy();
//   });
// });

import { Command } from '../command.interface';
import { TransferCmd } from './transfer-cmd';
import { MultiLanguage } from '../../../../system/multi-language/multi-language';
import i18next from 'i18next';
import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
import { FakeBeneficiariesDataRepo } from '../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
import { FakeTwilio } from '../../fake-twilio/fake-twilio';
import {
  Aid,
  DeployedShelter,
  FakeClient,
  FakeServer,
  Rpc,
} from '@xcapit/shelter-sdk';
import { Keypair } from '@stellar/stellar-sdk';

describe('TransferCmd', () => {
  let transferCmd: Command;
  const aTestPhoneNumber = '1234';
  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });
  const shelter = new DeployedShelter(
    Keypair.random(),
    new Rpc(new FakeServer()),
    new FakeClient({}),
  );
  const fakeBeneficiaries = new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio());
  const fakeAid = { transfer: () => Promise.resolve() } as unknown as Aid;

  beforeEach(() => {
    transferCmd = new TransferCmd(
      aTestPhoneNumber,
      ['BO1', '0.00000001', 'GDHEG5ILDSXMUGFJFA6JJOIV6J3YUG7O3SLKK7HPD25664FBY66AEQV5'],
      fakeBeneficiaries,
      shelter,
      fakeAid,
      new Rpc(new FakeServer()),
    );
  });

  test('new', () => {
    expect(transferCmd).toBeTruthy();
  });

  test("success bodyResponse", async () => {
    expect(await transferCmd.bodyResponse()).toEqual("Your tokens have been sent! Your balance is: 1e-7 BO1.");
  });

  [
    {
      name: "with throw error from smart account",
      params: ['BO1', '10', 'GDHEG5ILDSXMUGFJFA6JJOIV6J3YUG7O3SLKK7HPD25664FBY66AEQV5'],
      beneficiaries: fakeBeneficiaries,
      shelter,
      anAid: { transfer: () => Promise.reject() } as unknown as Aid,
      rpc: new Rpc(new FakeServer())
    },
    {
      name: "with wrong params",
      params: ["BO1"],
      beneficiaries: fakeBeneficiaries,
      shelter,
      anAid: fakeAid,
      rpc: new Rpc(new FakeServer())
    },
  ].forEach((testCase) => {
    test(`bodyResponse fail ${testCase.name}`, async () => {
      const transferCmd = new TransferCmd(
        aTestPhoneNumber,
        testCase.params,
        testCase.beneficiaries,
        testCase.shelter,
        testCase.anAid,
        testCase.rpc
      );

      expect(await transferCmd.bodyResponse()).toContain("failed");
    });
  });

  test('destinationNumber', () => {
    expect(transferCmd.destinationNumber()).toEqual(aTestPhoneNumber);
  });
});

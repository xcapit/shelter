import { Beneficiaries } from '../../../../beneficiaries/models/beneficiaries/beneficiaries';
import { FakeBeneficiariesDataRepo } from '../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
import { Command } from '../command.interface';
import { BalanceCmd } from './balance-cmd';
import { MultiLanguage } from '../../../../system/multi-language/multi-language';
import i18next from 'i18next';
import { FakeTwilio } from '../../fake-twilio/fake-twilio';
import {
  Shelter,
  FakeClient,
  FakeServer,
  Rpc,
} from '@xcapit/shelter-sdk';
import { Keypair } from '@stellar/stellar-sdk';

describe('BalanceCmd', () => {
  let balanceCmd: Command;
  const tokenSymbol = 'BO1';
  const aTestPhoneNumber = '1234';
  const shelter = new Shelter(
    Keypair.random(),
    new Rpc(new FakeServer()),
    new FakeClient({}),
  );

  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });

  beforeEach(() => {
    balanceCmd = new BalanceCmd(
      [tokenSymbol],
      aTestPhoneNumber,
      new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
      shelter,
    );
  });

  test('new', () => {
    expect(balanceCmd).toBeTruthy();
  });

  test('bodyResponse', async () => {
    expect(await balanceCmd.bodyResponse()).toContain(`${tokenSymbol}`);
  });

  test('bodyResponse with error', async () => {
    expect(
      await new BalanceCmd(
        ['ANOTHER'],
        '',
        new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
        shelter,
      ).bodyResponse(),
    ).toContain('Balance error');
  });

  test('destinationNumber', () => {
    expect(balanceCmd.destinationNumber()).toEqual(aTestPhoneNumber);
  });
});

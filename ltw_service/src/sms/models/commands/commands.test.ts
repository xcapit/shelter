import {
  Shelter,
  FakeClient,
  FakeServer,
  Rpc,
} from '@xcapit/shelter-sdk';
import { Beneficiaries } from '../../../beneficiaries/models/beneficiaries/beneficiaries';
import { FakeBeneficiariesDataRepo } from '../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo';
import { FakeTwilio } from '../fake-twilio/fake-twilio';
import { IncomingSms } from '../incoming-sms/incoming-sms';
import { ParsedIncomingSms } from '../parsed-incoming-sms/parsed-incoming-sms';
import { Commands } from './commands';
import { Keypair } from '@stellar/stellar-sdk';

describe('Commands', () => {
  let commands: Commands;

  beforeEach(() => {
    commands = new Commands(
      new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
      new Shelter(
        Keypair.random(),
        new Rpc(new FakeServer()),
        new FakeClient({}),
      ),
      new FakeTwilio(),
    );
  });

  test('new', () => {
    expect(commands).toBeTruthy();
  });

  [
    { commandName: 'balance', body: 'BALANCE BO1' },
    { commandName: 'transfer', body: 'SEND BO1 10 0xface' },
    { commandName: 'account', body: 'ACCOUNT' },
    { commandName: 'update phone', body: 'UPDATE_PHONE +5431234' },
    { commandName: 'confirm phone', body: 'CONFIRM_PHONE 1234' },
    // { commandName: 'offramp', body: 'OFFRAMP 3 BO1 ARS' },
    { commandName: 'null', body: 'ISNOTACOMMAND 10 BO1' },
  ].forEach((testCase) => {
    test(`command ${testCase.commandName}`, async () => {
      expect(
        await commands.of(
          new ParsedIncomingSms(new IncomingSms({ Body: testCase.body })),
        ),
      ).toBeTruthy();
    });
  });
});

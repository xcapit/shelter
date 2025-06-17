import { Beneficiaries } from '../../../beneficiaries/models/beneficiaries/beneficiaries';
import { AccountCmd } from '../command/account-cmd/account-cmd';
import { Command } from '../command/command.interface';
import { NullCommand } from '../command/null-cmd/null-cmd';
import { UpdatePhoneNumberConfirmationCmd } from '../command/update-phone-number-confirmation/update-phone-number-confirmation';
import { UpdatePhoneNumberProposalCmd } from '../command/update-phone-number-proposal-cmd/update-phone-number-proposal-cmd';
import { ParsedIncomingSms } from '../parsed-incoming-sms/parsed-incoming-sms';
// TODO
// import { TransferCmd } from '../command/transfer-cmd/transfer-cmd';
// import { PrivateKeyOf } from '../../../beneficiaries/models/private-key/private-key-of/private-key-of';
// import { AlchemySmartAccount } from '../../../beneficiaries/models/smart-account/alchemy-smart-account/alchemy-smart-account';
// import { OffRampCmd } from '../command/offramp-cmd/offramp-cmd';
import { TranslatedKey } from '../../../system/multi-language/translated-key/translated-key';
import twilio from 'twilio';
import dotenv from 'dotenv';
import process, { env } from 'process';
import { FakeTwilio } from '../../../sms/models/fake-twilio/fake-twilio';
import { PhoneNumberUpdates } from '../../../beneficiaries/models/phone-number-updates/phone-number-updates';
import { DefaultPhoneNumberUpdatesDataRepo } from '../../../beneficiaries/models/data-repo/phone-number-updates-data-repo/default/default-phone-number-updates-data-repo';
import { BalanceCmd } from '../command/balance-cmd/balance-cmd';
import { DeployedShelter, Rpc, ShelterClient } from '@xcapit/shelter-sdk';
import { Keypair, Networks, rpc } from '@stellar/stellar-sdk';

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
export class Commands {
  constructor(
    private _beneficiaries: Beneficiaries,
    private _shelter: DeployedShelter,
    private _client: twilio.Twilio | FakeTwilio = twilio(
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
    ),
  ) {}

  async of(aParsedIncomingSms: ParsedIncomingSms): Promise<Command> {
    return (
      (await this._commands(aParsedIncomingSms)).get(
        aParsedIncomingSms.commandName(),
      ) ||
      new NullCommand(await this._beneficiaryPhoneNumber(aParsedIncomingSms))
    );
  }

  private async _commands(
    parsedIncomingSms: ParsedIncomingSms,
  ): Promise<Map<string, Command>> {
    return new Map<string, Command>([
      [
        new TranslatedKey('BALANCE').toString(),
        new BalanceCmd(
          parsedIncomingSms.commandParams(),
          await this._beneficiaryPhoneNumber(parsedIncomingSms),
          this._beneficiaries,
          this._shelter,
        ),
      ],
      // TODO
      // [
      //   new TranslatedKey('SEND').toString(),
      //   new TransferCmd(
      //     parsedIncomingSms.phoneNumber(),
      //     parsedIncomingSms.commandParams(),
      //     new AlchemySmartAccount(
      //       new PrivateKeyOf(
      //         await this._beneficiaryPhoneNumber(parsedIncomingSms),
      //         this._beneficiaries,
      //       ),
      //     ),
      //     this._beneficiaries,
      //   ),
      // ],
      [
        new TranslatedKey('ACCOUNT').toString(),
        new AccountCmd(parsedIncomingSms.phoneNumber(), this._beneficiaries),
      ],
      [
        new TranslatedKey('UPDATE_PHONE').toString(),
        new UpdatePhoneNumberProposalCmd(
          await this._beneficiaryPhoneNumber(parsedIncomingSms),
          parsedIncomingSms.commandParams(),
          new PhoneNumberUpdates(
            new DefaultPhoneNumberUpdatesDataRepo(),
            this._client,
          ),
        ),
      ],
      [
        new TranslatedKey('CONFIRM_PHONE').toString(),
        new UpdatePhoneNumberConfirmationCmd(
          await this._beneficiaryPhoneNumber(parsedIncomingSms),
          parsedIncomingSms.commandParams(),
          this._beneficiaries,
          new PhoneNumberUpdates(
            new DefaultPhoneNumberUpdatesDataRepo(),
            this._client,
          ),
        ),
      ],
      // TODO
      // [
      //   new TranslatedKey('OFFRAMP').toString(),
      //   new OffRampCmd(
      //     parsedIncomingSms.phoneNumber(),
      //     parsedIncomingSms.commandParams(),
      //     this._beneficiaries,
      //     new AlchemySmartAccount(
      //       new PrivateKeyOf(
      //         await this._beneficiaryPhoneNumber(parsedIncomingSms),
      //         this._beneficiaries,
      //       ),
      //     ),
      //   ),
      // ],
    ]);
  }

  private async _beneficiaryPhoneNumber(
    parsedIncomingSms: ParsedIncomingSms,
  ): Promise<string> {
    return (
      await this._beneficiaries.findOneBy(parsedIncomingSms.phoneNumber())
    ).phoneNumber();
  }
}

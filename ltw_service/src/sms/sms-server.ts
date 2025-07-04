import { ServerSystem } from '../system/server-system';
import { Express, NextFunction, Response } from 'express';
import { Beneficiaries } from '../beneficiaries/models/beneficiaries/beneficiaries';
import { Command } from './models/command/command.interface';
import { Commands } from './models/commands/commands';
import { ParsedIncomingSms } from './models/parsed-incoming-sms/parsed-incoming-sms';
import { IncomingSms } from './models/incoming-sms/incoming-sms';
import { SMS } from './models/sms/sms';
import { TwilioSMSClient } from './models/sms-client/twilio-sms-client/twilio-sms-client';
import dotenv from 'dotenv';
import process from 'process';
import { SMSWebhookRequestOf } from './models/sms-webhook-request-of/sms-webhook-request-of';
import { Users } from '../users/models/users/users';
import { AuthorizedRequestOf } from '../system/authorized-request/authorized-request-of';
import { OnlyRoles } from '../system/only-roles/only-roles';
import { Shelter } from '@xcapit/shelter-sdk';

dotenv.config();

const { TWILIO_AUTH_TOKEN, TWILIO_WEBHOOK_URL } = process.env;

export class SMSServer extends ServerSystem {
  constructor(
    private _aServer: Express,
    private _beneficiaries: Beneficiaries,
    private _users: Users,
    private _shelter: Shelter,
  ) {
    super();
  }

  register() {
    this._aServer.post('/api/sms/incoming', (req, res, next) =>
      this._executeCommand(
        new SMSWebhookRequestOf(req, TWILIO_AUTH_TOKEN!, TWILIO_WEBHOOK_URL!),
        res,
        next,
      ),
    );
    this._aServer.post(
      '/api/sms/incoming-test',
      new OnlyRoles(this._users, 'Admin').allowedRole(),
      (req, res, next) =>
        this._executeCommandTest(new AuthorizedRequestOf(req), res, next),
    );
  }

  private async _executeCommand(
    req: SMSWebhookRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        const command: Command = await new Commands(
          this._beneficiaries,
          this._shelter,
        ).of(new ParsedIncomingSms(new IncomingSms(req.body())));
        new SMS(
          command.destinationNumber(),
          await command.bodyResponse(),
          new TwilioSMSClient(),
        ).send();
        res.send();
      },
      res,
      next,
    );
  }

  private async _executeCommandTest(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        await (
          await this._users.findOneBy(req.username())
        ).ifActiveDo(async () => {
          const command: Command = await new Commands(
            this._beneficiaries,
            this._shelter,
          ).of(new ParsedIncomingSms(new IncomingSms(req.body())));
          res.send(await command.bodyResponse());
        });
      },
      res,
      next,
    );
  }
}

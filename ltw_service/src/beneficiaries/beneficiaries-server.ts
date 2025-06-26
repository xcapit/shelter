import { Express, NextFunction, Response } from 'express';
import { Beneficiaries } from './models/beneficiaries/beneficiaries';
import { ServerSystem } from '../system/server-system';
import { SMS } from '../sms/models/sms/sms';
import { SmartAccountCreationMsg } from './models/messages/smart-account-creation-msg/smart-account-creation-msg';
import { TwilioSMSClient } from '../sms/models/sms-client/twilio-sms-client/twilio-sms-client';
import { Users } from '../users/models/users/users';
import { AuthorizedRequestOf } from '../system/authorized-request/authorized-request-of';
import { Tokens } from './models/tokens/tokens';
import { OnlyRoles } from '../system/only-roles/only-roles';
import { Sponsor } from './models/sponsor/sponsor';
import { env } from 'process';
import dotenv from 'dotenv';
import { Keypair } from '@stellar/stellar-sdk';
import { DeployedShelter } from '@xcapit/shelter-sdk';
import { PhoneNumber } from '../shared/phone-number-info/phone-number';
import { AidTTL } from './models/aid-ttl/aid-ttl';
import { WeiOf } from './models/wei-of/wei-of';

dotenv.config();

export class BeneficiariesServer extends ServerSystem {
  constructor(
    private _aServer: Express,
    private _beneficiaries: Beneficiaries,
    private _users: Users,
    private _shelter: DeployedShelter,
  ) {
    super();
  }

  register() {
    this._aServer.post(
      '/api/beneficiaries',
      new OnlyRoles(this._users, ['Admin', 'NGO']).allowedRole(),
      (req, res, next) =>
        this._createBeneficiary(new AuthorizedRequestOf(req), res, next),
    );
    this._aServer.post(
      '/api/beneficiaries/deactivate-account',
      new OnlyRoles(this._users, ['Admin', 'NGO']).allowedRole(),
      (req, res, next) =>
        this._deactivateBeneficiary(new AuthorizedRequestOf(req), res, next),
    );
    this._aServer.get(
      '/api/beneficiaries/:phoneNumber/:token/balance',
      new OnlyRoles(this._users, ['Admin', 'NGO']).allowedRole(),
      (req, res, next) =>
        this._checkBeneficiaryBalance(new AuthorizedRequestOf(req), res, next),
    );
    this._aServer.post(
      '/api/beneficiaries/bound-aid',
      new OnlyRoles(this._users, ['Admin', 'NGO']).allowedRole(),
      (req, res, next) =>
        this._boundAid(new AuthorizedRequestOf(req), res, next),
    );
  }

  private async _createBeneficiary(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        return await (
          await this._users.findOneBy(req.username())
        ).ifActiveDo<string>(async () => {
          try {
            await this._beneficiaries.save(
              req.body(),
              await Sponsor.from(env.SPONSOR_SECRET!).createAccount(),
            );
            const beneficiary = await this._beneficiaries.findOneBy(
              req.body().phoneNumber,
            );

            new SMS(
              beneficiary.phoneNumber(),
              new SmartAccountCreationMsg(beneficiary.address()).toString(),
              new TwilioSMSClient(),
            ).send();
            return 'Smart Account created successfully!';
          } catch (error: any) {
            console.log('Create beneficiary failed: ', error);
            return 'Smart Account creation failed.';
          }
        });
      },
      res,
      next,
    );
  }

  private async _deactivateBeneficiary(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        // TODO:
        // return await (
        //   await this._users.findOneBy(req.username())
        // ).ifActiveDo<string>(async () => {
        //   await this._beneficiaries.deactivate(
        //     await this._beneficiaries.findOneBy(req.body().phoneNumber),
        //   );
        //   return 'Smart Account deactivate successfully!';
        // });
      },
      res,
      next,
    );
  }

  private async _checkBeneficiaryBalance(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        // TODO:
        // await (
        //   await this._users.findOneBy(req.username())
        // ).ifActiveDo<string>(async () => {
        //   const beneficiaryBalance = await new BalanceOf(
        //     await new Tokens().oneBy(req.params().token),
        //     (
        //       await this._beneficiaries.findOneBy(req.params().phoneNumber)
        //     ).address(),
        //   ).toJson()
        //   res.json(beneficiaryBalance);
        //   return 'Balance retrieved successfully'
        // });
      },
      res,
      next,
    );
  }

  private async _boundAid(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        const token = await new Tokens().oneBy(req.body().token);
        return await this._shelter.boundAid(
          Keypair.fromPublicKey(
            (
              await this._beneficiaries.findOneBy(
                await new PhoneNumber(req.body().phoneNumber).value(),
              )
            ).address(),
          ).rawPublicKey(),
          token.address(),
          new WeiOf(req.body().amount, token).value(),
          BigInt(new AidTTL(req.body().expiration).expirationDate()),
        );
      },
      res,
      next,
    );
  }
}

import { ServerSystem } from '../system/server-system';
import { Express, NextFunction, Response } from 'express';
import { Beneficiaries } from '../beneficiaries/models/beneficiaries/beneficiaries';
import { SMS } from '../sms/models/sms/sms';
import { Tokens } from '../beneficiaries/models/tokens/tokens';
import { TwilioSMSClient } from '../sms/models/sms-client/twilio-sms-client/twilio-sms-client';
import {
  CompleteOrderData,
  completeOrderSerializer,
} from '../beneficiaries/serializers/complete-order.serializer';
// TODO
// import { Orders } from "./models/orders/orders";
// import {AlchemySmartAccount} from "../beneficiaries/models/smart-account/alchemy-smart-account/alchemy-smart-account";
// import { PrivateKeyOf } from "../beneficiaries/models/private-key/private-key-of/private-key-of";
// import { Transfer } from "../beneficiaries/models/transfer/transfer";
import { OrderOfReqBody } from './models/order-of-req-body/order-of-req-body';
import { OrderCompleteMsg } from './models/messages/order-complete-msg/order-complete-msg';
import { DefaultOrder } from './models/order/default-order/default-order';
import { BalanceOf } from '../shared/balance-of/balance-of';
import { BeneficiaryOrderResponse } from './models/beneficiary-order-response/beneficiary-order-response';
import { AuthorizedRequestOf } from '../system/authorized-request/authorized-request-of';
import { Users } from '../users/models/users/users';
import { StatusMsg } from '../metrics/models/status-msg/status-msg';
import { Limit } from '../system/limit/limit';
import { OnlyRoles } from '../system/only-roles/only-roles';
import {
  Aid,
  DeployedShelter,
  Pass,
  Rpc,
  SAC,
  ShelterClient,
} from '@xcapit/shelter-sdk';
import { Keypair, rpc as stellarRpc } from '@stellar/stellar-sdk';
import dotenv from 'dotenv';
import { env } from 'process';
import { WeiOf } from '../beneficiaries/models/wei-of/wei-of';
import { SecretOf } from '../beneficiaries/models/secret-of/secret-of';
import { Orders } from './models/orders/orders';

dotenv.config();

export class OrdersServer extends ServerSystem {
  constructor(
    private _aServer: Express,
    private _orders: Orders,
    private _beneficiaries: Beneficiaries,
    private _users: Users,
    private _shelter: DeployedShelter,
  ) {
    super();
  }

  register() {
    this._aServer.post(
      '/api/orders',
      new OnlyRoles(this._users, ['Admin', 'Merchant']).allowedRole(),
      (req, res, next) =>
        this._createOrder(new AuthorizedRequestOf(req), res, next),
    );
    this._aServer.post(
      '/api/orders/complete',
      new OnlyRoles(this._users, ['Admin', 'Merchant']).allowedRole(),
      (req, res, next) =>
        this._completeOrder(new AuthorizedRequestOf(req), res, next),
    );
    this._aServer.get(
      '/api/orders/beneficiaries/:phoneNumber',
      new OnlyRoles(this._users, ['Admin', 'NGO']).allowedRole(),
      (req, res, next) =>
        this._findLatestOrdersByBeneficiary(
          new AuthorizedRequestOf(req),
          res,
          next,
        ),
    );
    this._aServer.get(
      '/api/orders/:orderId/status',
      new OnlyRoles(this._users, ['Admin', 'Merchant']).allowedRole(),
      (req, res, next) =>
        this._getOrderStatus(new AuthorizedRequestOf(req), res, next),
    );
  }

  private async _createOrder(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        return await (
          await this._users.findOneBy(req.username())
        ).ifActiveDo<void>(async () => {
          const order = new OrderOfReqBody(
            req.body(),
            this._beneficiaries,
            new Tokens(),
          );
          const savedOrder = new DefaultOrder(await this._orders.save(order));

          new SMS(
            await order.beneficiaryPhoneNumber(),
            await order.otpMsg(),
            new TwilioSMSClient(),
          ).send();

          res.send(new BeneficiaryOrderResponse(savedOrder).toJSON());
        });
      },
      res,
      next,
    );
  }

  private async _completeOrder(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        await (
          await this._users.findOneBy(req.username())
        ).ifActiveDo<void>(async () => {
          const serializedData: CompleteOrderData =
            await completeOrderSerializer.validate(req.body());

          const order = await this._orders.findOneByOTPandPhoneNumber(
            serializedData.otp,
            serializedData.phoneNumber,
          );

          await this._orders.validateOrder(order);

          let bodyResponse = 'Transfer error!';
          const token = await new Tokens().oneBy(order.tokenSymbol());
          const beneficiary = await this._beneficiaries.findOneBy(
            order.phoneNumber(),
          );

          const sponsorKeypair = Keypair.fromSecret(env.SPONSOR_SECRET!);
          
          const rpc = new Rpc(new stellarRpc.Server(env.STELLAR_RPC!));
          const sac = new SAC({
            contractId: token.address(),
            networkPassphrase: await rpc.network(),
            rpcUrl: rpc.url(),
            publicKey: sponsorKeypair.publicKey(),
          });

          await new Aid(sponsorKeypair, sac, rpc).transfer(
            this._shelter,
            order.merchAddress(),
            new WeiOf(order.amount(), token).value(),
            new Pass(
              Keypair.fromSecret(
                await new SecretOf(beneficiary.phoneNumber()).value(),
              ),
              this._shelter.id(),
              rpc,
            ),
          );

          bodyResponse = new OrderCompleteMsg(
            await new BalanceOf(
              token,
              beneficiary.keypair(),
              this._shelter,
            ).toAmount(),
            token,
          ).toString();

          await this._orders.completeOrder(order);

          new SMS(
            order.phoneNumber(),
            bodyResponse,
            new TwilioSMSClient(),
          ).send();

          res.send(new StatusMsg('Order Completed!').toJson());
        });
      },
      res,
      next,
    );
  }

  private async _findLatestOrdersByBeneficiary(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        // TODO:
        // return await (await this._users.findOneBy(req.username())).ifActiveDo<void>(async () => {
        //   const orders = await this._orders.findLatestBy(
        //     (await this._beneficiaries.findOneBy(
        //       req.params().phoneNumber,
        //     )).phoneNumber(),
        //     new Limit(req).toInt()
        //   );
        //   res.send(orders.map(order => new BeneficiaryOrderResponse(order).toJSON()));
        // });
      },
      res,
      next,
    );
  }

  private async _getOrderStatus(
    req: AuthorizedRequestOf,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    await this.executeAction(
      async () => {
        return await (
          await this._users.findOneBy(req.username())
        ).ifActiveDo<void>(async () => {
          const order = await this._orders.findOneById(req.params().orderId);
          res.send({ status: order.status() });
        });
      },
      res,
      next,
    );
  }
}

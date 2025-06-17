import { Express } from "express";
import { Beneficiaries } from "./beneficiaries/models/beneficiaries/beneficiaries";
import { Orders } from "./orders/models/orders/orders";
import { Users } from "./users/models/users/users";
import { UsersServer } from "./users/users-server";
import { SMSServer } from "./sms/sms-server";
import { BeneficiariesServer } from "./beneficiaries/beneficiaries-server";
import { OrdersServer } from "./orders/orders-server";
import { MultiLanguage } from "./system/multi-language/multi-language";
import i18next from "i18next";
import { MetricsServer } from "./metrics/metrics-server";
import { DeployedShelter } from "@xcapit/shelter-sdk";

export class LowTechServer {

  constructor(
    private _aServer: Express,
    private _beneficiaries: Beneficiaries,
    private _orders: Orders,
    private _users: Users,
    private _shelter: DeployedShelter
  ) { }

  register() {
    new MultiLanguage(i18next).init();
    new MetricsServer(this._aServer).register();
    new UsersServer(this._aServer, this._users).register(); // TODO: Reviewed!
    new SMSServer(this._aServer, this._beneficiaries, this._users, this._shelter).register(); // TODO: Reviewed!
    new OrdersServer(this._aServer, this._orders, this._beneficiaries, this._users, this._shelter).register(); // TODO: Reviewed!
    new BeneficiariesServer(this._aServer, this._beneficiaries, this._users, this._shelter).register();// TODO: Reviewed!
  }
}

import express from "express";
import {OrdersServer} from "./orders-server";
import {Orders} from "./models/orders/orders";
import {
  FakeBeneficiaryOrdersDataRepo
} from "../beneficiaries/models/data-repo/beneficiary-orders-data-repo/fake/fake-beneficiary-orders-data-repo";
import {rawBeneficiaryOrder} from "../fixtures/raw-beneficiary-order";
import {Beneficiaries} from "../beneficiaries/models/beneficiaries/beneficiaries";
import {
  DefaultBeneficiariesDataRepo
} from "../beneficiaries/models/data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo";
import {FakeMongoModel} from "../db/mongo/fake-mongo/fake-mongo.model";
import { Users } from "../users/models/users/users";
import {UsersDataRepo} from "../users/models/users-data-repo/users-data-repo";
import { FakeTwilio } from "../sms/models/fake-twilio/fake-twilio";

describe('Orders server', () => {
  const aServer = express();
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const beneficiaries = new Beneficiaries(new DefaultBeneficiariesDataRepo(fakeMongoModelInstance), new FakeTwilio());
  const orders = new Orders(new FakeBeneficiaryOrdersDataRepo(rawBeneficiaryOrder));
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));

  test('new', () => {
    expect(new OrdersServer(aServer, orders, beneficiaries, users)).toBeTruthy();
  });

  test('register', () => {
    const ordersServer = new OrdersServer(aServer, orders, beneficiaries, users);

    ordersServer.register();
  });
});

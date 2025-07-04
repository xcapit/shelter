import { FakeMongoModel } from "./db/mongo/fake-mongo/fake-mongo.model";
import { Beneficiaries } from "./beneficiaries/models/beneficiaries/beneficiaries";
import {
  DefaultBeneficiariesDataRepo
} from "./beneficiaries/models/data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo";
import { Orders } from "./orders/models/orders/orders";
import {
  FakeBeneficiaryOrdersDataRepo
} from "./beneficiaries/models/data-repo/beneficiary-orders-data-repo/fake/fake-beneficiary-orders-data-repo";
import { rawBeneficiaryOrder } from "./fixtures/raw-beneficiary-order";
import { Users } from "./users/models/users/users";
import { UsersDataRepo } from "./users/models/users-data-repo/users-data-repo";
import { LowTechServer } from "./low-tech-server";
import express from "express";
import { FakeTwilio } from "./sms/models/fake-twilio/fake-twilio";
import { Shelter } from "@xcapit/shelter-sdk";


describe('Low Tech Server', () => {
  const aServer = express();
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const beneficiaries = new Beneficiaries(new DefaultBeneficiariesDataRepo(fakeMongoModelInstance), new FakeTwilio());
  const orders = new Orders(new FakeBeneficiaryOrdersDataRepo(rawBeneficiaryOrder));
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));
  const shelter = {} as Shelter;


  test('new', () => {
    expect(new LowTechServer(aServer, beneficiaries, orders, users, shelter)).toBeTruthy();
  });

  test('register', () => {
    const server = new LowTechServer(aServer, beneficiaries, orders, users, shelter);

    server.register();
  });
});

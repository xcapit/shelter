import express from "express";
import { FakeMongoModel } from "../db/mongo/fake-mongo/fake-mongo.model";
import { Beneficiaries } from "../beneficiaries/models/beneficiaries/beneficiaries";
import {
  DefaultBeneficiariesDataRepo
} from "../beneficiaries/models/data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo";
import { SMSServer } from "./sms-server";
import { FakeTwilio } from "./models/fake-twilio/fake-twilio";
import { Users } from "../users/models/users/users";
import { UsersDataRepo } from "../users/models/users-data-repo/users-data-repo";
import { Shelter } from "@xcapit/shelter-sdk";


describe('SMSs server', () => {
  const aServer = express();
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const beneficiaries = new Beneficiaries(new DefaultBeneficiariesDataRepo(fakeMongoModelInstance), new FakeTwilio());
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));
  const shelter = {} as Shelter;

  test('new', () => {
    expect(new SMSServer(aServer, beneficiaries, users, shelter)).toBeTruthy();
  });

  test('register', () => {
    const server = new SMSServer(aServer, beneficiaries, users, shelter);

    server.register();
  });
});

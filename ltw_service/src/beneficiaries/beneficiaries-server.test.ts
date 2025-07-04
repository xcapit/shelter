import { Beneficiaries } from "./models/beneficiaries/beneficiaries";
import { FakeMongoModel } from "../db/mongo/fake-mongo/fake-mongo.model";
import express from "express";
import { BeneficiariesServer } from "./beneficiaries-server";
import {
  DefaultBeneficiariesDataRepo
} from "./models/data-repo/beneficiaries-data-repo/default/default-beneficiaries-data-repo";
import { Users } from "../users/models/users/users";
import { UsersDataRepo } from "../users/models/users-data-repo/users-data-repo";
import { FakeTwilio } from "../sms/models/fake-twilio/fake-twilio";
import { Shelter } from "@xcapit/shelter-sdk";

describe('Beneficiaries server', () => {
  const aServer = express();
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));
  const beneficiaries = new Beneficiaries(new DefaultBeneficiariesDataRepo(fakeMongoModelInstance), new FakeTwilio());
  const shelter = {} as Shelter;

  test('new', () => {
    expect(new BeneficiariesServer(aServer, beneficiaries, users, shelter)).toBeTruthy();
  });

  test('register', () => {
    const beneficiariesServer = new BeneficiariesServer(aServer, beneficiaries, users, shelter);

    beneficiariesServer.register();
  });
});

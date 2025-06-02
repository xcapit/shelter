import {Users} from "./models/users/users";
import {UsersDataRepo} from "./models/users-data-repo/users-data-repo";
import {FakeMongoModel} from "../db/mongo/fake-mongo/fake-mongo.model";
import express from "express";
import {UsersServer} from "./users-server";


describe('Users server', () => {
  const aServer = express();
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));

  test('new', () => {
    expect(new UsersServer(aServer, users)).toBeTruthy();
  });

  test('register', () => {
    const usersServer = new UsersServer(aServer, users);

    usersServer.register();
  });
});

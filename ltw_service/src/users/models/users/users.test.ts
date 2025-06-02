import {UsersDataRepo} from "../users-data-repo/users-data-repo";
import {DefaultUser} from "../user/default-user";
import {Password} from "../password/password";
import {Users} from "./users";
import {FakeMongoModel} from "../../../db/mongo/fake-mongo/fake-mongo.model";
import {HashedPassword} from "../hashed-password/hashed-password";
import {Email} from "../email/email";
import { Role } from "../role/role";

describe('Users', () => {
  const anUserRole = new Role('NGO');
  const anEmailValue = 'test@test.com';
  const anEmail = new Email(anEmailValue);
  const aPassword = new Password('aPassword');
  const aHashedPassword = new HashedPassword(aPassword.hash());
  const anUser = new DefaultUser(anUserRole, anEmail, aHashedPassword, true);
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));

  test('new', () => {
    expect(users).toBeTruthy();
  });

  test('save & findOneBy', async () => {
    await users.save(anUser);

    const savedUser: any = await users.findOneBy(anEmailValue);

    expect(savedUser.username()).toEqual(anUser.username());
  });

  test('null user on findOneBy ', async () => {
    const users = new Users(new UsersDataRepo(new FakeMongoModel(null).create()));

    const user: any = await users.findOneBy(anEmailValue);

    expect(() => user.username()).toThrow();
  });
});

import {Email} from "../email/email";
import {Password} from "../password/password";
import {Users} from "../users/users";
import {UsersDataRepo} from "../users-data-repo/users-data-repo";
import {FakeMongoModel} from "../../../db/mongo/fake-mongo/fake-mongo.model";
import {HashedPassword} from "../hashed-password/hashed-password";
import {DefaultUser} from "../user/default-user";
import {Credentials} from "./credentials";
import {User} from "../user/user";
import { Role } from "../role/role";


describe('Credentials', () => {
  const anUserRole = new Role('NGO');
  const anEmail = new Email('test@test.com');
  const aPasswordValue = 'aPassword';
  const aPassword = new Password(aPasswordValue);
  const aHashedPasswordValue = aPassword.hash();
  const aHashedPassword = new HashedPassword(aHashedPasswordValue);
  const fakeMongoModelInstance = new FakeMongoModel().create();
  const anUser: User = new DefaultUser(anUserRole, anEmail, aHashedPassword, true);
  const users = new Users(new UsersDataRepo(fakeMongoModelInstance));

  test('new', () => {
    expect(new Credentials(anEmail, aPassword, users)).toBeTruthy();
  });

  test('jwt', async () => {
    await users.save(anUser);

    expect(await new Credentials(anEmail, aPassword, users).jwt()).toBeTruthy();
  });
});

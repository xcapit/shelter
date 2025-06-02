import {Password} from "../password/password";
import {UsersDataRepo} from "./users-data-repo";
import {FakeMongoModel} from "../../../db/mongo/fake-mongo/fake-mongo.model";
import {Model} from "mongoose";
import {HashedPassword} from "../hashed-password/hashed-password";
import {Email} from "../email/email";
import {DefaultUser} from "../user/default-user";
import { Role } from "../role/role";


describe('Users Data Repo', () => {
  let aDataRepo: UsersDataRepo;
  let fakeMongoModelInstance: Model<any>;
  const anUserRole = new Role('NGO');
  const anEmailValue = 'test@test.com';
  const anEmail = new Email(anEmailValue);
  const aPassword = new Password('aPassword');
  const aHashedPassword = new HashedPassword(aPassword.hash());
  const anUser = new DefaultUser(anUserRole, anEmail, aHashedPassword, true);

  beforeEach(() => {
    fakeMongoModelInstance = new FakeMongoModel().create();
    aDataRepo = new UsersDataRepo(fakeMongoModelInstance);
  });

  test('new', () => {
    expect(aDataRepo).toBeTruthy();
  });

  test('save & findOneBy', async () => {
    await aDataRepo.save(anUser);
    const rawUserData: any = await aDataRepo.findOneBy(anEmailValue);
    expect(rawUserData?.username).toEqual(anUser.username());
    expect(rawUserData?.role).toEqual(anUser.role());
  });
});

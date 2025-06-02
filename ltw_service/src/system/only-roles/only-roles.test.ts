import { Request, Response } from 'express';
import { Users } from '../../users/models/users/users';
import { User } from '../../users/models/user/user';
import { DefaultUser } from '../../users/models/user/default-user';
import { Role } from '../../users/models/role/role';
import { Email } from '../../users/models/email/email';
import { Password } from '../../users/models/password/password';
import { HashedPassword } from '../../users/models/hashed-password/hashed-password';
import { FakeMongoModel } from '../../db/mongo/fake-mongo/fake-mongo.model';
import { UsersDataRepo } from '../../users/models/users-data-repo/users-data-repo';
import { Credentials } from '../../users/models/credentials/credentials';
import { OnlyRoles } from './only-roles';

describe('OnlyRoles', () => {
  let nextCalled = false;
  const anUserRole = new Role('NGO');
  const anEmail = new Email('test@test.com');
  const aPasswordValue = 'aPassword';
  const aPassword = new Password(aPasswordValue);
  const aHashedPasswordValue = aPassword.hash();
  const aHashedPassword = new HashedPassword(aHashedPasswordValue);
  const anUser: User = new DefaultUser(
    anUserRole,
    anEmail,
    aHashedPassword,
    true,
  );
  let users: Users;

  const mockResponse = () => {
    let statusCode: number | null = null;
    let jsonResponse: any = null;

    const res = {
      status: function (code: number) {
        statusCode = code;
        return {
          json: function (msg: any) {
            jsonResponse = msg;
          },
        };
      },
    } as unknown as Response;

    return {
      res,
      getStatusCode: () => statusCode,
      getJson: () => jsonResponse,
    };
  };

  const mockRequestWithJWT = async () => {
    const aCredentialJWT = await new Credentials(anEmail, aPassword, users).jwt();
    const req = {
      headers: {
        authorization: `Bearer ${aCredentialJWT}`,
      },
      header: (name: string) => {
        return req.headers[name.toLowerCase()];
      },
    } as any as Request;
    return req;
  };

  beforeEach(() => {
    nextCalled = false;
    const fakeMongoModelInstance = new FakeMongoModel().create();
    users = new Users(new UsersDataRepo(fakeMongoModelInstance));
  });

  test('new', () => {
    expect(new OnlyRoles(users, 'Admin')).toBeTruthy();
  });

  test('correct role', async () => {
    await users.save(anUser);
    const req = await mockRequestWithJWT();
    const res = {} as any as Response;

    const onlyRoles = new OnlyRoles(users, 'NGO');
    const middleware = onlyRoles.allowedRole();

    await middleware(req, res, () => { nextCalled = true });

    expect(nextCalled).toBe(true);
  });

  test('more than one role', async () => {
    await users.save(anUser);
    const req = await mockRequestWithJWT()
    const res = {} as any as Response

    const onlyRoles = new OnlyRoles(users, ['NGO', 'Admin']);
    const middleware = onlyRoles.allowedRole();

    await middleware(req, res, () => { nextCalled = true });

    expect(nextCalled).toBe(true);
  });

  test('incorrect role', async () => {
    await users.save(anUser);
    const req = await mockRequestWithJWT()
    const { res, getStatusCode, getJson } = mockResponse()

    const onlyRoles = new OnlyRoles(users, 'Admin');
    const middleware = onlyRoles.allowedRole();

    await middleware(req, res, () => { nextCalled = true });

    expect(nextCalled).toBe(false);
    expect(getStatusCode()).toBe(403);
    expect(getJson()).toEqual({ error: 'Access denied: insufficient role' });
  });

  test('server error', async () => {
    const req = {
      headers: {
        authorization: `Bearer anIncorrectToken`,
      },
      header: (name: string) => {
        return req.headers[name.toLowerCase()];
      },
    } as any as Request;

    const { res, getStatusCode, getJson } = mockResponse()

    const onlyRoles = new OnlyRoles(users, 'Admin');
    const middleware = onlyRoles.allowedRole();

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatusCode()).toBe(500);
    expect(getJson()).toEqual({ error: 'Internal server error' });
  });
});

import {DefaultUser} from "./default-user";
import {Password} from "../password/password";
import {HashedPassword} from "../hashed-password/hashed-password";
import {Email} from "../email/email";
import {User} from "./user";
import { Role } from "../role/role";


describe('DefaultUser', () => {
  let anUser: User;
  const anUserRole = new Role('NGO');
  const anEmailValue = 'test@test.com';
  const anEmail = new Email(anEmailValue);
  const aPasswordValue = 'aPassword';
  const aPassword = new Password(aPasswordValue);
  const aHashedPasswordValue = aPassword.hash();
  const aHashedPassword = new HashedPassword(aHashedPasswordValue);

  beforeEach(() => {
    anUser = new DefaultUser(
      anUserRole,
      anEmail,
      aHashedPassword,
      true
    );
  })

  test('new', () => {
    expect(anUser).toBeTruthy();
  });

  test('active', () => {
    expect(anUser.active()).toBeTruthy();
  });

  test('role', () => {
    expect(anUser.role()).toEqual(anUserRole.toString());
  });

  test('email', () => {
    expect(anUser.username()).toEqual(anEmailValue);
  });

  test('do only on an active user', async () => {
    const result = await anUser.ifActiveDo<string>(async () => {
      return "test result";
    });

    expect(result).toBe("test result");
  });

  test('don\'t do it on an not active user', async () => {
    const aNotActiveUser = new DefaultUser(anUserRole, anEmail, aHashedPassword, false);
    let a = 1;

    await expect(aNotActiveUser.ifActiveDo(async () => { a += 1; })).rejects.toThrow('User is not active.');
    expect(a).toBe(1);
  });

  test('hashedPassword', () => {
    expect(anUser.hashedPassword()).toEqual(aHashedPasswordValue);
  });

  test('jwt on good password but not active user', () => {
    const notActiveUser = new DefaultUser(
      anUserRole,
      anEmail,
      aHashedPassword,
      false
    );

    expect(() => notActiveUser.jwtOf(aPasswordValue)).toThrow();
  });

  test('jwt on good password', () => {
    expect(anUser.jwtOf(aPasswordValue)).toBeTruthy();
  });

  test('jwt on bad password', () => {
    expect(() => anUser.jwtOf('aWrongPassword')).toThrow();
  });
})

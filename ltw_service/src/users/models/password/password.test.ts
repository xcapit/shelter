import {Password} from "./password";
import {HashedPassword} from "../hashed-password/hashed-password";


describe('Password', () => {
  let aPassword: Password;
  let aHashedPassword: HashedPassword;
  const aPasswordString = 'aPasswordString';

  beforeEach(() => {
    aPassword = new Password(aPasswordString);
    aHashedPassword = new HashedPassword(aPassword.hash());
  });

  test('new', () => {
    expect(aPassword).toBeTruthy();
  });

  test('toString', () => {
    expect(`${aPassword}`).toEqual(aPasswordString);
  });

  test('required value', () => {
    expect(() => new Password('')).toThrow();
  });

  test('hash', () => {
    expect(() => { aHashedPassword.validate(aPasswordString); }).not.toThrow();
  });
});

import {Password} from "../password/password";
import {HashedPassword} from "./hashed-password";


describe('hashedPassword', () => {
  const aTestHash = 'aHash';
  const aPasswordValue = 'aPassword';

  test('new', () => {
    expect(new HashedPassword(aTestHash)).toBeTruthy();
  });

  test('toString', () => {
    expect(`${new HashedPassword(aTestHash)}`).toEqual(aTestHash);
  });

  test('required value', () => {
    expect(() => new HashedPassword('')).toThrow();
  });

  test('validate is not ok', () => {
    expect(() => { new HashedPassword(aTestHash).validate(aPasswordValue); }).toThrow();
  });

  test('validate is ok', () => {
    const password = new Password(aPasswordValue);

    expect(() => { new HashedPassword(password.hash()).validate(aPasswordValue); }).not.toThrow();
  });
});

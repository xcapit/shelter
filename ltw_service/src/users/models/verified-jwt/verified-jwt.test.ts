import {JWT} from "../jwt/jwt";
import {Email} from "../email/email";
import {VerifiedJWT} from "./verified-jwt";


describe('VerifiedJWT', () => {
  const aSecret = 'supersecret';
  const anInvalidJWTValue = 'asdf';
  const aTestEmail = new Email('test@test.com');
  const aValidJWT = new JWT(aTestEmail.toString(), aSecret);

  test('new', () => {
    expect(new VerifiedJWT(`${aValidJWT}`, aSecret)).toBeTruthy();
  });

  test('throw of invalid jwt value', () => {
    expect(() => new VerifiedJWT(anInvalidJWTValue, aSecret)).toThrow();
  });

  test('username', () => {
    const verifiedJWT = new VerifiedJWT(`${aValidJWT}`, aSecret);

    expect(verifiedJWT.username()).toEqual(aTestEmail.toString());
  });
});

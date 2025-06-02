import {JWT} from "./jwt";

describe('JWT', () => {
  let jwt: JWT;
  const aSecret = 'supersecret';
  const anUsername = 'test@test.com';
  const anExpirationTime = "1h";

  beforeEach(() => {
    jwt = new JWT(anUsername, aSecret, anExpirationTime);
  });

  test('new', () => {
    expect(jwt).toBeTruthy();
  });

  test('toString', () => {
    const result = jwt.toString();

    expect(`${jwt}`).toEqual(result);
  })

  test('new required an username value', () => {
    expect(() => new JWT('')).toThrow();
  });

  test('new required a secret value', () => {
    expect(() => new JWT('asdf', '')).toThrow();
  });

  test('new required a expiration time value value', () => {
    expect(() => new JWT('asdf', 'asdf', '')).toThrow();
  });
})

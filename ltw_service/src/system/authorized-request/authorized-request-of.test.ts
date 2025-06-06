import {JWT} from "../../users/models/jwt/jwt";
import {AuthorizedRequestOf} from "./authorized-request-of";
import {rawRequest, rawEmail, rawBody, rawParams, rawQuery} from "../../fixtures/raw-request-data";

describe('Authorized Request', () => {
  let request: AuthorizedRequestOf;

  beforeEach(() => {
    request = new AuthorizedRequestOf(rawRequest(`Bearer ${new JWT(rawEmail)}`));
  });

  test('new', () => {
    expect(request).toBeTruthy();
  });

  test('body access', () => {
    expect(request.body()).toEqual(rawBody);
  });

  test('params access', () => {
    expect(request.params()).toEqual(rawParams);
  });

  test('username access', () => {
    expect(request.username()).toEqual(rawEmail);
  });

  test('query access', () => {
    expect(request.query()).toEqual(rawQuery);
  });

  test('throw error when jwt token is invalid', () => {
    expect(() => (new AuthorizedRequestOf(rawRequest('invalidToken')))).toThrow();
  });
});

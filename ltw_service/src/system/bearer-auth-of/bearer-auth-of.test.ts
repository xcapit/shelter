import {BearerAuthOf} from "./bearer-auth-of";


describe('Bearer Auth Of', () => {
  const aTestToken = 'aToken';
  const _aTestRequest = (returnValue: string): any => {
    return {header: (aHeaderName: string) => returnValue}
  };

  test('new', () => {
    expect(new BearerAuthOf(_aTestRequest(`Bearer ${aTestToken}`))).toBeTruthy();
  });

  test('fail validations', () => {
    expect(() => new BearerAuthOf(_aTestRequest(''))).toThrow();
  });

  test('token', () => {
    expect(new BearerAuthOf(_aTestRequest(`Bearer ${aTestToken}`)).token()).toEqual(aTestToken);
  });
});

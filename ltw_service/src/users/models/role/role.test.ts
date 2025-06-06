import { Role } from "./role";

describe('Role', () => {
  let role: Role;
  const aRoleValue = 'Admin';

  beforeEach(() => {
    role = new Role(aRoleValue);
  });

  test('new', () => {
    expect(role).toBeTruthy();
    expect(() => new Role('Beneficiary')).toBeTruthy();
    expect(() => new Role('Merchant')).toBeTruthy();
    expect(() => new Role('NGO')).toBeTruthy();
  });

  test('toString', () => {
    expect(`${role}`).toEqual(aRoleValue);
  });

  test('new on invalid role value', () => {
    expect(() => new Role('asdf@')).toThrow();
  });
});

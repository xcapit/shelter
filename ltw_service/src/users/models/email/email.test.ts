import {Email} from "./email";

describe('Email', () => {
  let email: Email;
  const anEmailValue = 'test@test.com';

  beforeEach(() => {
    email = new Email(anEmailValue);
  });

  test('new', () => {
    expect(email).toBeTruthy();
  });

  test('toString', () => {
    expect(`${email}`).toEqual(anEmailValue);
  });

  test('new required an email value', () => {
    expect(() => new Email('')).toThrow();
  });

  test('new on invalid email value', () => {
    expect(() => new Email('asdf@')).toThrow();
  });
});

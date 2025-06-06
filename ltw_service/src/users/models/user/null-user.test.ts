import {User} from "./user";
import {NullUser} from "./null-user";


describe('NullUser', () => {
  let user: User;

  beforeEach(() => {
    user = new NullUser();
  });

  test('new', () => {
    expect(user).toBeTruthy();
  });

  test('throw error on access', async () => {
    expect(() => user.active()).toThrow();
    expect(() => user.username()).toThrow();
    expect(() => user.role()).toThrow();
    expect(() => user.jwtOf('asdf')).toThrow();
    expect(() => user.hashedPassword()).toThrow();
    await expect(user.ifActiveDo(async () => {})).rejects.toThrow('Null user cannot do this action');
  });
});

import { Token } from "../token.interface";
import { NullToken } from "./null-token";

describe("NullToken", () => {
  let token: Token;

  beforeEach(() => {
    token = new NullToken();
  });

  test("new", () => {
    expect(token).toBeTruthy();
  });

  test("symbol", () => {
    expect(() => token.symbol()).toThrow();
  });

  test("decimals", () => {
    expect(() => token.decimals()).toThrow();
  });

  test("address", () => {
    expect(token.address()).toEqual('');
  });

});

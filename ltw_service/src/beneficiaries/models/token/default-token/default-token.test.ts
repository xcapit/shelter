import { rawTokenData } from "../../../../fixtures/raw-tokens-data";
import { Token } from "../token.interface";
import { DefaultToken } from "./default-token";

describe("DefaultToken", () => {
  let token: Token;

  beforeEach(() => {
    token = new DefaultToken(rawTokenData);
  });

  test("new", () => {
    expect(token).toBeTruthy();
  });

  test("address", () => {
    expect(token.address()).toEqual(rawTokenData.contract);
  });

});

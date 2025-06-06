import { rawUSDCData } from "../../../../fixtures/raw-tokens-data";
import { Token } from "../token.interface";
import { DefaultToken } from "./default-token";

describe("DefaultToken", () => {
  let token: Token;

  beforeEach(() => {
    token = new DefaultToken(rawUSDCData);
  });

  test("new", () => {
    expect(token).toBeTruthy();
  });

  test("address", () => {
    expect(token.address()).toEqual(rawUSDCData.contract);
  });

  test("abi", () => {
    expect(token.abi()).toEqual(rawUSDCData.abi);
  });
});

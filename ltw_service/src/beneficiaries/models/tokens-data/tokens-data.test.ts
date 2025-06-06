import { TokensData } from "./tokens-data";

describe("TokensData", () => {
  let tokensData: TokensData;

  beforeEach(() => {
    tokensData = new TokensData();
  });

  test("new", () => {
    expect(tokensData).toBeTruthy();
  });

  test("value", () => {
    expect(tokensData.value().length).toBeGreaterThan(0);
  });
});

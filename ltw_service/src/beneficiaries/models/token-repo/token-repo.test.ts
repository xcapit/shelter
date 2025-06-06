import { rawTokensData, rawUSDCData } from "../../../fixtures/raw-tokens-data";
import { TokenRepo } from "./token-repo";

describe("TokenRepo", () => {
  test("new", () => {
    expect(new TokenRepo(rawTokensData)).toBeTruthy();
  });

  test("all", () => {
    expect(new TokenRepo(rawTokensData).all()).toBeTruthy();
  });

  test("oneBy", () => {
    expect(new TokenRepo(rawTokensData).oneBy(rawUSDCData.symbol)).toBeTruthy();
  });
});

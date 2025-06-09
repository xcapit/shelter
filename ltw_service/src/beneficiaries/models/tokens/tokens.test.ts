import { rawTokenData, rawTokensData } from '../../../fixtures/raw-tokens-data';
import { TokenRepo } from '../token-repo/token-repo';
import { Tokens } from './tokens';

describe('Tokens', () => {
  let tokens: Tokens;

  beforeEach(() => {
    tokens = new Tokens(new TokenRepo(rawTokensData));
  });

  test('new', () => {
    expect(new Tokens(new TokenRepo([]))).toBeTruthy();
  });

  test('value', async () => {
    expect((await tokens.value()).length).toBeGreaterThan(0);
  });

  test('access to an individual token', async () => {
    const token = (await tokens.value())[0];

    expect(token.symbol()).toEqual(rawTokensData[0].symbol);
  });

  test('oneBy', async () => {
    expect((await tokens.oneBy(rawTokenData.symbol)).symbol()).toEqual(
      rawTokenData.symbol,
    );
  });

  test('oneBy null token', async () => {
    const tokens = new Tokens(new TokenRepo([]));
    const token = await tokens.oneBy(rawTokenData.symbol);
    expect(() => token.symbol()).toThrow();
  });
});

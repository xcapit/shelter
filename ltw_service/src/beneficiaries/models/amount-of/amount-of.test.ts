import { rawTokenData } from '../../../fixtures/raw-tokens-data';
import { DefaultToken } from '../token/default-token/default-token';
import { Token } from '../token/token.interface';
import { AmountOf } from './amount-of';

describe('Amount Of', () => {
  let amount: AmountOf;
  const token: Token = new DefaultToken(rawTokenData);
  const aWeiAmount = BigInt(6196);
  const anAmount = 0.0006196;

  beforeEach(() => {
    amount = new AmountOf(aWeiAmount, token);
  });

  test('new', () => {
    expect(amount).toBeTruthy();
  });

  test('value access', () => {
    expect(amount.value()).toEqual(anAmount);
  });

  test('wei access', () => {
    expect(amount.weiValue()).toEqual(aWeiAmount);
  });
});

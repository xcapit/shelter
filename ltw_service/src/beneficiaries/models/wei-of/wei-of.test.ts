import { DefaultToken } from '../token/default-token/default-token';
import { rawTokenData } from '../../../fixtures/raw-tokens-data';
import { WeiOf } from './wei-of';

describe('WeiOf', () => {
  let wei: WeiOf;

  beforeEach(() => {
    wei = new WeiOf(1, new DefaultToken(rawTokenData));
  });

  test('new', () => {
    expect(wei).toBeTruthy();
  });

  test('value', () => {
    expect(wei.value().toString()).toBe('10000000');
  });
});

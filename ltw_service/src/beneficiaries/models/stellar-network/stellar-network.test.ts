import { StellarNetwork } from './stellar-network';

describe('StellarNetwork', () => {
  test('new', () => {
    expect(new StellarNetwork('0')).toBeTruthy();
  });

  test('new failed on wrong values', () => {
    expect(() => new StellarNetwork('3')).toThrow();
  });

  test('value on nonprod', () => {
    expect(`${new StellarNetwork('0').value().server.serverURL}`).toContain(
      'test',
    );
  });

  test('value on prod', () => {
    expect(`${new StellarNetwork('1').value().server.serverURL}`).not.toContain(
      'test',
    );
  });
});

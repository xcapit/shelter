// TODO:
// import { GeneratedPrivateKey } from '../generated-private-key/generated-private-key';
// import { PrivateKeySharding } from './private-key-sharding';
//
// describe('PrivateKeySharding', () => {
//   const privateKeySharding = new PrivateKeySharding();
//   const privateKeySharding2 = new PrivateKeySharding();
//   const privateKey = new GeneratedPrivateKey().value();
//   const _minRequiredShares = (shares: string[]) => {
//     const { PRIVATE_KEY_THRESHOLD } = process.env;
//
//     return shares.slice(0, +PRIVATE_KEY_THRESHOLD!);
//   };
//
//   test('new', () => {
//     expect(PrivateKeySharding).toBeTruthy();
//   });
//
//   test('split', async () => {
//     const { PRIVATE_KEY_NUM_SHARES } = process.env;
//
//     const shares = await privateKeySharding.split(await privateKey);
//
//     expect(shares).toHaveLength(+PRIVATE_KEY_NUM_SHARES!);
//     shares.forEach(share => { expect(typeof share).toBe("string"); });
//   });
//
//   test('combine', async () => {
//     const shares = await privateKeySharding.split(await privateKey);
//
//     expect(
//       await privateKeySharding2.combine(_minRequiredShares(shares)),
//     ).toEqual(await privateKey);
//   });
// });

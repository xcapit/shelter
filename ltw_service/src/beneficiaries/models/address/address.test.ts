// TODO:
// import {Address} from "./address";

// describe("Address", () => {

//   const notValidAddress = "aadsasd"
//   const checksumAddress = "0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC"
//   const notChecksumAddress = "0xa5cc3c03994db5b0d9a5eEdD10Cabab0813678ac"

//   test("new", () => {
//     expect(new Address(checksumAddress)).toBeTruthy();
//   });

//   test("manage not checksum address", () => {
//     expect(new Address(notChecksumAddress).toString()).toEqual(checksumAddress);
//   });

//   test("manage checksum address", () => {
//     expect(new Address(checksumAddress).toString()).toEqual(checksumAddress);
//   });

//   test("exception when not valid address", () => {
//     expect(() => new Address(notValidAddress).toString()).toThrow();
//   });
// });

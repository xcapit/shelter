// TODO:
// import { Hex } from "viem";
// import { PrivateKey } from "../private-key.interface";
// import { GeneratedPrivateKey } from "./generated-private-key";
//
// describe("GeneratedPrivateKey", () => {
//   let privateKey: PrivateKey;
//
//   beforeEach(() => {
//     privateKey = new GeneratedPrivateKey(() => "0x" as Hex);
//   });
//
//   test("new", () => {
//     expect(privateKey).toBeTruthy();
//   });
//
//   test("value", async () => {
//     expect(await new GeneratedPrivateKey().value()).toContain("0x");
//   });
//
//   test("cached value", async () => {
//     privateKey = new GeneratedPrivateKey();
//     expect(await privateKey.value()).toEqual(await privateKey.value());
//   });
//
//   test("value with fake", async () => {
//     expect(await privateKey.value()).toEqual("0x" as Hex);
//   });
// });

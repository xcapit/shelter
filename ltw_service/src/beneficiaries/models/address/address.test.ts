import { Address } from "./address";

describe("Address", () => {

  const notValidAddress = "aadsasd"
  const gAddress = 'GDIQCQETMJNQU7W4FRYA62ARS4JH32L45YDLZHS7CMOSMBD6OU7Z252T';
  const cAddress = 'CDOE74SDU5HUEBKJJCHQJPFSU5CGARYWSHRJCEWY73APTOL2QFD5DQ56';
  const mAddress = 'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAABUTGI4';

  test("new", () => {
    expect(new Address(gAddress)).toBeTruthy();
  });

  test("manage c address", () => {
    expect(new Address(cAddress).toString()).toEqual(cAddress);
  });

  test("manage g address", () => {
    expect(new Address(gAddress).toString()).toEqual(gAddress);
  });

  test("manage m address", () => {
    expect(new Address(mAddress).toString()).toEqual(mAddress);
  });

  test("exception when not valid address", () => {
    expect(() => new Address(notValidAddress).toString()).toThrow();
  });
});

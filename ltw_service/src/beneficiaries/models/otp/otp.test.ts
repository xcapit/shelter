import { OTP } from "./otp";

describe("OTP", () => {
  let otp: OTP;

  beforeEach(() => {
    otp = new OTP();
  });

  test("new", () => {
    expect(otp).toBeTruthy();
  });

  test("value", () => {
    expect(otp.value()).toBeTruthy();
  });

  test("cached value", () => {
    expect(otp.value()).toEqual(otp.value());
  });
});

import { PhoneNumberUpdate } from "../phone-number-update.interface";
import { NullPhoneNumberUpdate } from "./null-phone-number-update";

describe("NullPhoneNumberUpdate", () => {
  let nullPhoneNumberUpdate: PhoneNumberUpdate;

  beforeEach(() => {
    nullPhoneNumberUpdate = new NullPhoneNumberUpdate();
  });

  test("new", () => {
    expect(nullPhoneNumberUpdate).toBeTruthy();
  });

  test("actualPhoneNumber", () => {
    expect(() => nullPhoneNumberUpdate.actualPhoneNumber()).toThrow();
  });

  test("newPhoneNumber", () => {
    expect(() => nullPhoneNumberUpdate.newPhoneNumber()).toThrow();
  });

  test("otp", () => {
    expect(() => nullPhoneNumberUpdate.otp()).toThrow();
  });
});

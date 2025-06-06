import { rawPhoneNumberUpdate } from "../../../../fixtures/raw-phone-number-update-data";
import { PhoneNumberUpdate } from "../phone-number-update.interface";
import { DefaultPhoneNumberUpdate } from "./default-phone-number-update";

describe("DefaultPhoneNumberUpdate", () => {
  let phoneNumberUpdate: PhoneNumberUpdate;

  beforeEach(() => {
    phoneNumberUpdate = new DefaultPhoneNumberUpdate(rawPhoneNumberUpdate);
  });

  test("new", () => {
    expect(phoneNumberUpdate).toBeTruthy();
  });

  test("newPhoneNumber", () => {
    expect(phoneNumberUpdate.newPhoneNumber()).toEqual(
      rawPhoneNumberUpdate.newPhoneNumber
    );
  });

  test("actualPhoneNumber", () => {
    expect(phoneNumberUpdate.actualPhoneNumber()).toEqual(
      rawPhoneNumberUpdate.actualPhoneNumber
    );
  });

  test("otp", () => {
    expect(phoneNumberUpdate.otp()).toEqual(rawPhoneNumberUpdate.otp);
  });
});

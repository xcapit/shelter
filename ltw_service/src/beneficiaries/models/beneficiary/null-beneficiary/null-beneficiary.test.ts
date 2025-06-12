import { Beneficiary } from "../beneficiary.interface";
import { NullBeneficiary } from "./null-beneficiary";

describe("NullBeneficiary", () => {
  let nullBeneficiary: Beneficiary;

  beforeEach(() => {
    nullBeneficiary = new NullBeneficiary();
  });

  test("new", () => {
    expect(nullBeneficiary).toBeTruthy();
  });

  test("phoneNumber", () => {
    expect(() => nullBeneficiary.phoneNumber()).toThrow();
  });

  test("address", () => {
    expect(() => nullBeneficiary.address()).toThrow();
  });

  test("networkProvider", () => {
    expect(() => nullBeneficiary.networkProvider()).toThrow();
  });

  test("countryCode", () => {
    expect(() => nullBeneficiary.countryCode()).toThrow();
  });

  test("keypair", () => {
    expect(() => nullBeneficiary.keypair()).toThrow();
  });
});

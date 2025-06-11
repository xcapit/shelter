import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
import { Beneficiary } from "../beneficiary.interface";
import { DefaultBeneficiary } from "./default-beneficiary";

describe("DefaultBeneficiary", () => {
  let beneficiary: Beneficiary;

  beforeEach(() => {
    beneficiary = new DefaultBeneficiary(rawBeneficiaryData);
  });

  test("new", () => {
    expect(beneficiary).toBeTruthy();
  });

  test("phoneNumber", () => {
    expect(beneficiary.phoneNumber()).toEqual(rawBeneficiaryData.phoneNumber);
  });

  test("address", () => {
    expect(beneficiary.address()).toEqual(rawBeneficiaryData.address);
  });

  test("keypair", () => {
    expect(beneficiary.keypair()).toBeTruthy();
  });
});

import { rawBeneficiaryData } from "../../../../fixtures/raw-beneficiary-data";
import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
import { FakeBeneficiariesDataRepo } from "../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
import { Command } from "../command.interface";
import { AccountCmd } from "./account-cmd";
import { FakeTwilio } from "../../fake-twilio/fake-twilio";

describe("AccountCmd", () => {
  let accountCmd: Command;
  const aTestPhoneNumber = "1234";

  beforeEach(() => {
    accountCmd = new AccountCmd(
      aTestPhoneNumber,
      new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio())
    );
  });

  test("new", () => {
    expect(accountCmd).toBeTruthy();
  });

  test("bodyResponse", async () => {
    expect(await accountCmd.bodyResponse()).toEqual(`${rawBeneficiaryData.address}`);
  });

  test("destinationNumber", () => {
    expect(accountCmd.destinationNumber()).toEqual(aTestPhoneNumber);
  });
});

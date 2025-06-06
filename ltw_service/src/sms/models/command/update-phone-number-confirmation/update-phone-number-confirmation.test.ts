import { Beneficiaries } from "../../../../beneficiaries/models/beneficiaries/beneficiaries";
import { FakeBeneficiariesDataRepo } from "../../../../beneficiaries/models/data-repo/beneficiaries-data-repo/fake/fake-beneficiaries-data-repo";
import { FakePhoneNumberUpdatesDataRepo } from "../../../../beneficiaries/models/data-repo/phone-number-updates-data-repo/fake/fake-phone-number-updates-data-repo";
import { PhoneNumberUpdates } from "../../../../beneficiaries/models/phone-number-updates/phone-number-updates";
import { FakeTwilio } from "../../fake-twilio/fake-twilio";
import { Command } from "../command.interface";
import { UpdatePhoneNumberConfirmationCmd } from "./update-phone-number-confirmation";

describe("UpdatePhoneNumberConfirmationCmd", () => {
  let command: Command;
  const anOTP = "1234";
  const aPhoneNumber = "aPhoneNumber";

  beforeEach(() => {
    command = new UpdatePhoneNumberConfirmationCmd(
      aPhoneNumber,
      [anOTP],
      new Beneficiaries(new FakeBeneficiariesDataRepo(), new FakeTwilio()),
      new PhoneNumberUpdates(new FakePhoneNumberUpdatesDataRepo(), new FakeTwilio())
    );
  });

  test("new", () => {
    expect(command).toBeTruthy();
  });

  test("bodyResponse", async () => {
    expect(await command.bodyResponse()).toBeTruthy();
  });

  test("destinationNumber", () => {
    expect(command.destinationNumber()).toEqual(aPhoneNumber);
  });
});

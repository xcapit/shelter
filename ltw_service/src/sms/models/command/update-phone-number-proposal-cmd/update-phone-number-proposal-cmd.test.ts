import { rawPhoneNumberUpdate } from "../../../../fixtures/raw-phone-number-update-data";
import { FakePhoneNumberUpdatesDataRepo } from "../../../../beneficiaries/models/data-repo/phone-number-updates-data-repo/fake/fake-phone-number-updates-data-repo";
import { PhoneNumberUpdates } from "../../../../beneficiaries/models/phone-number-updates/phone-number-updates";
import { Command } from "../command.interface";
import { UpdatePhoneNumberProposalCmd } from "./update-phone-number-proposal-cmd";
import {MultiLanguage} from "../../../../system/multi-language/multi-language";
import i18next from "i18next";
import { FakeTwilio } from "../../fake-twilio/fake-twilio";

describe("UpdatePhoneNumberProposalCmd", () => {
  let command: Command;
  const aNewPhoneNumber = "1234";

  beforeAll(() => {
    new MultiLanguage(i18next).init();
  });

  beforeEach(() => {
    command = new UpdatePhoneNumberProposalCmd("aPhoneNumber", [
      aNewPhoneNumber,
    ],
    new PhoneNumberUpdates(new FakePhoneNumberUpdatesDataRepo(rawPhoneNumberUpdate),
    new FakeTwilio()  
  ),
  );
  });

  test("new", () => {
    expect(command).toBeTruthy();
  });

  test("bodyResponse", async () => {
    expect(await command.bodyResponse()).toBeTruthy();
  });

  test("destinationNumber", () => {
    expect(command.destinationNumber()).toEqual(aNewPhoneNumber);
  });
});

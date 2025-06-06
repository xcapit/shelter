import { IncomingSms } from "../incoming-sms/incoming-sms";
import { ParsedIncomingSms } from "./parsed-incoming-sms";

describe("ParsedIncomingSms", () => {
  let parsedIncomingSms: ParsedIncomingSms;
  const aCmdName = "Balance";
  const aParams = "USDC";
  const rawTwilioData = { From: "+1234", Body: `${aCmdName} ${aParams}` };

  beforeEach(() => {
    parsedIncomingSms = new ParsedIncomingSms(new IncomingSms(rawTwilioData));
  });

  test("new", () => {
    expect(parsedIncomingSms).toBeTruthy();
  });

  test("commandName", () => {
    expect(parsedIncomingSms.commandName()).toEqual("BALANCE");
  });

  test("commandParams", () => {
    expect(parsedIncomingSms.commandParams()).toEqual([aParams]);
  });

  test("phoneNumber", () => {
    expect(parsedIncomingSms.phoneNumber()).toEqual(rawTwilioData.From);
  });
});

import { FakeTwilio } from "../fake-twilio/fake-twilio";
import { TwilioSMSClient } from "../sms-client/twilio-sms-client/twilio-sms-client";
import { SMS } from "./sms";

describe("SMS", () => {
  let sms: SMS;

  beforeEach(() => {
    sms = new SMS("to", "body", new TwilioSMSClient(new FakeTwilio()));
  });

  test("new", () => {
    expect(sms).toBeTruthy();
  });

  test("send", async () => {
    expect(await sms.send()).toBeTruthy();
  });
});

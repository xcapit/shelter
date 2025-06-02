import { FakeTwilio } from "../../fake-twilio/fake-twilio";
import { TwilioSMSClient } from "./twilio-sms-client";

describe("TwilioSMSClient", () => {
  let twilioSMSClient: TwilioSMSClient;

  beforeEach(() => {
    twilioSMSClient = new TwilioSMSClient(new FakeTwilio());
  });

  test("new", () => {
    expect(twilioSMSClient).toBeTruthy();
  });

  test("send", async () => {
    expect(await twilioSMSClient.send("aPhoneNumber", "aMsgBody")).toBeTruthy();
  });
});

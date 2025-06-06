import { IncomingSms } from "./incoming-sms";

describe("IncomingSms", () => {
  let incomingSms: IncomingSms;
  const rawTwilioData = { From: "+1234", Body: "Hello!" };
  beforeEach(() => {
    incomingSms = new IncomingSms(rawTwilioData);
  });

  test("new", () => {
    expect(incomingSms).toBeTruthy();
  });

  test("from", () => {
    expect(incomingSms.from()).toEqual(rawTwilioData.From);
  });

  test("body", () => {
    expect(incomingSms.body()).toEqual(rawTwilioData.Body);
  });
});

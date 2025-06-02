import { FakeTwilio } from "./fake-twilio";

describe("FakeTwilio", () => {
  let fakeTwilio: FakeTwilio;

  beforeEach(() => {
    fakeTwilio = new FakeTwilio();
  });

  test("new", () => {
    expect(fakeTwilio).toBeTruthy();
  });

  test("messages", () => {
    expect(fakeTwilio.messages.create({ to: "" })).toBeTruthy();
  });
});

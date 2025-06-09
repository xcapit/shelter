import { AidTTL } from "./aid-ttl";

describe("AidTTL", () => {
  let ttl: AidTTL;
  const date = new Date();

  beforeEach(() => {
    ttl = new AidTTL(30, date);
  });

  test("new", () => {
    expect(ttl).toBeTruthy();
  });

  test("expiredDate", () => {
    expect(ttl.expirationDate()).toBeGreaterThan(date.getTime());
  });
});

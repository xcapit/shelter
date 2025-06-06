import { TTL } from "./ttl";

describe("TTL", () => {
  let ttl: TTL;
  const date = new Date();
  beforeEach(() => {
    ttl = new TTL(30, date);
  });

  test("new", () => {
    expect(ttl).toBeTruthy();
  });

  test("expiredDate", () => {
    expect(ttl.expirationDate()).toBeGreaterThan(date.getTime());
  });
});

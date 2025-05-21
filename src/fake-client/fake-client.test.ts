import { Keypair } from "shelter-sdk";
import { FakeClient } from "../fake-client/fake-client";

describe("FakeClient", () => {
  const steward = Keypair.random();

  test("new", () => {
    expect(new FakeClient({}, steward)).toBeTruthy();
  });

  test("steward", async () => {
    expect(await new FakeClient({}, steward).steward()).toEqual(
      steward.publicKey()
    );
  });
});

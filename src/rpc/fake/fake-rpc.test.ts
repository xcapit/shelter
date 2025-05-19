import type { Rpc } from "../rpc.interface";
import { FakeRpc } from "./fake-rpc";

describe("FakeRpc", () => {
  let rpc: Rpc;

  beforeAll(() => {
    rpc = new FakeRpc();
  });
  test("new", () => {
    expect(new FakeRpc()).toBeTruthy();
  });

  test("url", () => {
    expect(rpc.url()).toEqual("aRpcUrl");
  });
});

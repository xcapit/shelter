import type { Rpc } from "../rpc.interface";
import { DefaultRpc } from "./default-rpc";

describe("DefaultRpc", () => {
  const rpcUrl = "anRpcUrl";
  let rpc: Rpc;

  beforeAll(() => {
    rpc = new DefaultRpc(rpcUrl);
  });
  test("new", () => {
    expect(new DefaultRpc(rpcUrl)).toBeTruthy();
  });

  test("url", () => {
    expect(rpc.url()).toEqual(rpcUrl);
  });
});

import { FakeServer } from "../fixtures/fixtures";
import { Rpc } from "./rpc";

describe("Rpc", () => {
  const serverURL = "aServerUrl";
  const passphrase = "aPassphrase";
  let rpc: Rpc;

  beforeAll(() => {
    rpc = new Rpc(new FakeServer(), {});
  });

  test("new", () => {
    expect(new Rpc(new FakeServer())).toBeTruthy();
  });

  test("url", () => {
    expect(rpc.url()).toEqual(serverURL);
  });

  test("network", async () => {
    expect(await rpc.network()).toEqual(passphrase);
  });
});

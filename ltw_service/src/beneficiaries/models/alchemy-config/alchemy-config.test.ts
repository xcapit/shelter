import { AlchemyConfig } from "./alchemy-config";


describe("AlchemyConfig", () => {
  let alchemyConfig: AlchemyConfig;
  const anApiKey = "anApiKey";
  const aPolicyId = "aPolicyId";

  beforeEach(() => {
    alchemyConfig = new AlchemyConfig("anApiKey", "aPolicyId");
  });

  test("new", () => {
    expect(alchemyConfig).toBeTruthy();
  });

  test("apiKey", () => {
    expect(alchemyConfig.apiKey()).toEqual(anApiKey);
  });

  test("policyId", () => {
    expect(alchemyConfig.policyId()).toEqual(aPolicyId);
  });
});

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testRegex: "./.*\\.(test|spec)\\.ts$",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {},
  testTimeout: 1000000,
  extensionsToTreatAsEsm: [".ts"],
};

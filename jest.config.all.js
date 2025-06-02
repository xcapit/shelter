export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testRegex: "./.*\\.(test|spec)\\.ts$",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {},
  testTimeout: 1000000,
  extensionsToTreatAsEsm: [".ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/packages/"],
  testPathIgnorePatterns: ["./ltw_service/"],
};

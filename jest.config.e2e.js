
export default {
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testEnvironment: "node",
  testRegex: "./src/tests/e2e/.*\\.(test|spec)?\\.(ts|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  roots: ["<rootDir>/src"],
};


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
};

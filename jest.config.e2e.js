export default {
  preset: "ts-jest/presets/default-esm",
  transform: {},
  testEnvironment: "node",
  testRegex: "./src/tests/e2e/.*\\.(test|spec)?\\.(ts|ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  extensionsToTreatAsEsm: [".ts"],
  // roots: ["<rootDir>/src"],
  testTimeout: 1000000,
};


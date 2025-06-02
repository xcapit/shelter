
export default {
  preset: "ts-jest/presets/default-esm",
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testRegex: './src/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: [
    "<rootDir>/src"
  ],
  testPathIgnorePatterns: [
    '<rootDir>/src/tests/e2e/'
  ],
  coveragePathIgnorePatterns: [
    ".*-server\\.ts$"
  ],
  extensionsToTreatAsEsm: ['.ts', '.mts'],
}

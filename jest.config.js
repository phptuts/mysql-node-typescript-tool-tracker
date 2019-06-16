
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/*.ts",
    "!src/test/*.ts",
    "!src/commands/*.ts*"
  ],
  coverageReporters: [
    "json", "lcov"
  ],
  setupFilesAfterEnv: [
      '<rootDir>/dist/test/pre-test.js'
      ]
};

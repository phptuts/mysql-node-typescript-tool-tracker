
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    "src/*.ts",
    "src/**/**/*.ts",
    "!src/startup.ts", // Ignoring startup file too hard to test
    "!src/database/*.ts", // Ignoring db file because it's config
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

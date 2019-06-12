
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "./app/**/*.ts"
  ],
  coverageReporters: [
    "json", "lcov"
  ],
  setupFilesAfterEnv: [
      '<rootDir>/dist/test/pre-test.js'
      ]
};

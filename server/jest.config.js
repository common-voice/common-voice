module.exports = {
  moduleNameMapper: {
    '^common$': '<rootDir>/../common/index.ts',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/js'],
  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

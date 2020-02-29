module.exports = {
  moduleNameMapper: {
    '^common$': '<rootDir>/../common/index.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

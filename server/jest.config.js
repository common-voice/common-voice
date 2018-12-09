module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': '<rootDir>/../node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
};

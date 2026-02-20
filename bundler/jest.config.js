module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/js'],
  preset: 'ts-jest',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
}

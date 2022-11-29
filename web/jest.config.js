module.exports = {
  moduleNameMapper: {
    '^common$': '<rootDir>/../common/index.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>/../node_modules'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^.+\\.svg$': 'jest-svg-transformer',
    '^.+\\.(png|jpg)$': 'jest-transform-stub',
    '^.+\\.css$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      diagnostics: {
        /* ignore add esModuleInterop warning */
        ignoreCodes: [151001],
      },
    },
  },
};

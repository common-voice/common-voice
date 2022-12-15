module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  plugins: ['import', '@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: [
      'tsconfig.eslint.json',
      './common/tsconfig.json',
      './web/tsconfig.json',
      './server/tsconfig.json',
    ],
  },
  rules: {
    // turn on errors for missing imports
    'import/no-unresolved': 'error',

    // warn us if we're using @ts-ignore etc..
    '@typescript-eslint/ban-ts-comment': 'warn',

    // Old code uses any a lot, just show a warn instead
    '@typescript-eslint/no-explicit-any': 'warn',
    // Disabling this because it seems there is no way for ESLint to know we use Localized for translating text
    'jsx-a11y/heading-has-content': 'off',
    'jsx-a11y/anchor-has-content': 'off',
  },
  settings: {
    react: {
      version: 'latest',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};

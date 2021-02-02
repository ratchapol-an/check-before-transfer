module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    camelcase: ['off', { ignoreDestructuring: true }],
    '@typescript-eslint/naming-convention': 'off',
    'no-console': 'off',
    'consistent-return': ['off'],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', { code: 120, ignoreUrls: true }],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    indent: ['error', 2],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    // createDefaultProgram: true,
  },
  plugins: ['react', '@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended'
  ],
  rules: {
    'prefer-promise-reject-errors': 'off',
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/prop-types': 'off',
    'react/static-property-placement': [
      'error',
      'static public field',
      {
        childContextTypes: 'static public field',
        contextTypes: 'static public field',
        contextType: 'static public field',
        defaultProps: 'static public field',
        displayName: 'static public field',
        propTypes: 'static public field',
      },
    ],
    'no-console': ['off'],
    'jsx-a11y/anchor-is-valid': 'off',
    'import/prefer-default-export': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      javascript: {},
    },
  },
};

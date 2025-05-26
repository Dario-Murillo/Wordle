import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  ...compat.extends('airbnb'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'import/no-extraneous-dependencies': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];

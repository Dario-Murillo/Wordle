import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  ...compat.extends('airbnb'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'react/react-in-jsx-scope': 'off', // Disable for Next.js
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], // Allow JSX in .js files,
      'import/no-extraneous-dependencies': 'off', // Disable for Next.js
    },
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];

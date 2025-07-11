import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    'next',
    'next/core-web-vitals',
    'next/typescript'
  ),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

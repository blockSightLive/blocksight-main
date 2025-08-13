// ESLint v9 flat config for backend (TypeScript)
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      // Allow bootstrap directive until local types are installed
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': false }],
      // Node globals in backend runtime
      'no-undef': 'off'
    }
  },
  eslintConfigPrettier
];



import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: ['lib/**', '_site/**', 'docs/**', 'node_modules/**', '*.js', '*.mjs']
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...tseslint.configs.recommended
        .filter((c) => c.rules)
        .reduce((acc, c) => ({ ...acc, ...c.rules }), {}),

      ...reactPlugin.configs.recommended.rules,

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      indent: 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'react/prop-types': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  {
    files: ['tests/**/*.ts', 'tests/**/*.tsx'],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/prefer-expect-assertions': [
        'error',
        { onlyFunctionsWithAsyncKeyword: true }
      ]
    }
  }
);

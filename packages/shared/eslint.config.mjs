import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: 2024,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            // Shared package rules
        },
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
        ],
    },
];

module.exports = {
    extends: ['expo', 'prettier'],
    rules: {
        // Disable rules that conflict with Expo Router conventions
        'import/no-unresolved': 'off',
    },
};

module.exports = {
    extends: 'erb',
    rules: {
        // A temporary hack related to IDE not resolving correct package.json
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'error',
        // Since React 17 and typescript 4.1 you can safely disable the rule
        'react/react-in-jsx-scope': 'off',
        'eslint-disable-next-line': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/destructuring-assignment': 'off',
        'react/require-default-props': 'off',
        'prettier/prettier': 'off',
        'react/no-array-index-key': 'off',
        "@typescript-eslint/lines-between-class-members": 'off',
        'promise/catch-or-return': 'off',
        'promise/always-return': 'off',
        'no-else-return': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
        'consistent-return': 'off'
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
    },
    settings: {
        'import/resolver': {
            // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
            node: {},
            webpack: {
                config: require.resolve(
                    './.erb/configs/webpack.config.eslint.ts'
                ),
            },
            typescript: {},
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
};

module.exports = {
  extends: 'plugin:@typescript-eslint/recommended',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
};

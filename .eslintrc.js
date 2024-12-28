module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-shadow': ['off'],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-shadow': 'off',
    'no-undef': 'off',
    'react/prop-types': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return types for React components
      },
    },
  ],
};

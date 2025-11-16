import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.mjs'],
  },
  {
    rules: {
      // Relax some overly strict rules for a publishable library
      'single-export/single-export': 'off', // Allow multiple exports from a file
      'ddd/require-spec-file': 'off', // Don't require spec files for every file
      'max-lines': ['error', { max: 250 }], // Increase max lines for Redux slices with selectors
      'error/no-generic-error': 'warn', // Allow generic Error for now
      'error/require-custom-error': 'warn', // Allow generic Error for now
      'no-restricted-syntax': 'off', // Allow type assertions
      'security/detect-object-injection': 'off', // False positive for Redux state access
      'no-optional-chaining/no-optional-chaining': 'off', // Allow optional chaining
    },
  },
  {
    // Test files can be longer
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'max-lines': ['error', { max: 350 }],
    },
  },
]

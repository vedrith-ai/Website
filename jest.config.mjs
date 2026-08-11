/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: false } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  passWithNoTests: true,
  collectCoverageFrom: [
    'lib/engines/**/*.ts',
    'lib/validators/**/*.ts',
    '!**/*.d.ts',
  ],
}

export default config

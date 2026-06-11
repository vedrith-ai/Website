import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: false } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/tests/unit/**/*.test.ts'],
  collectCoverageFrom: [
    'lib/engines/**/*.ts',
    'lib/validators/**/*.ts',
    '!lib/engines/**/*.d.ts',
  ],
}

export default config

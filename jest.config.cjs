module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest']
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/setupJestGlobals.ts', '<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+/firebase(.ts)?$': '<rootDir>/src/firebase.jest.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};

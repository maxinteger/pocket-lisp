const path = require('path')

const rootDir = __dirname
const src = path.join(rootDir, 'src')
const coverageDirectory = path.join(rootDir, 'coverage')

module.exports = {
  rootDir: rootDir,
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleDirectories: ['node_modules', src, rootDir],
  testMatch: ['**/*.{spec,test}.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory
}

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverageFrom: [
    'src/**'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  expand: true,
  forceExit: false
}

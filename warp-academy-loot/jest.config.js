module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  moduleFileExtensions: ['js'],

  testEnvironment: 'node',

  testMatch: ['**/tests/**/?(*.)+(spec).+(js)'],

  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@assemblyscript|hex-rgb/.*)'],

  transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
};

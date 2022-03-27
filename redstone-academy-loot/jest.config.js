module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  moduleFileExtensions: ['js'],

  testEnvironment: 'node',

  testMatch: ['**/tests/**/?(*.)+(spec).+(js)'],

  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@assemblyscript/.*)'],

  transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
};

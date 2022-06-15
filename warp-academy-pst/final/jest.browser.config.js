module.exports = {
  clearMocks: true,

  moduleFileExtensions: ['ts', 'js'],

  testPathIgnorePatterns: ['/.yalc/', '/data/', '/_helpers'],

  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@assemblyscript/.*)'],

  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },

  testEnvironment: './browser-jest-env.js',
};

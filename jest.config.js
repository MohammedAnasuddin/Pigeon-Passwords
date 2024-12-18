// export default {
//   testEnvironment: "jsdom",  // Use only one test environment setting
//   setupFilesAfterEnv: ["<rootDir>/setupTests.js"],  // Adjust the path as needed
// };



export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // This tells Jest to use Babel to transform .js and .jsx files
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Adjust path as necessary
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Mock CSS imports
  },
  reporters: [
    "default",
    ["jest-html-reporters", {
      pageTitle: "Test Report on Pigeon Passwords",
      outputPath: "test-report.html",
      includeFailureMsg: true,
      showOnlyFailed: false
    }]
  ],
};

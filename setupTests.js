// setupTests.js
import '@testing-library/jest-dom';
import 'dotenv/config';
require('dotenv').config();

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}), // Return whatever structure you expect
        text: () => Promise.resolve(JSON.stringify({})),
    })
);
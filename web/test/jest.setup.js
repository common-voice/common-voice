// jest.setup.js

// mock crypto
const { Crypto } = require('@peculiar/webcrypto');
global.crypto = new Crypto();

// ignore console.debug messages
console.debug = () => null;

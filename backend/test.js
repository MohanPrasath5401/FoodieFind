// test.js
require('dotenv').config();
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);
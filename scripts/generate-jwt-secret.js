const crypto = require('crypto');

// Generate a random JWT secret
const generateJwtSecret = () => {
    return crypto.randomBytes(32).toString('base64'); // Generates 256 bits of randomness
};

console.log(generateJwtSecret());

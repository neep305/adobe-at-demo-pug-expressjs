const crypto = require('crypto');

// Simple password hashing for demo (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(inputPassword, storedHash) {
  return hashPassword(inputPassword) === storedHash;
}

module.exports = {
  hashPassword,
  verifyPassword
};

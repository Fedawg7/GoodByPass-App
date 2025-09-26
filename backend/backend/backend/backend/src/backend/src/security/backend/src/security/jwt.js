// jwt.js - JWT helpers (very small)
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_SIGN_KEY || 'dev_jwt_key_change';

function sign(payload, opts = { expiresIn: '1h' }) {
  return jwt.sign(payload, JWT_KEY, { algorithm: 'HS256', ...opts });
}
function verify(token) {
  return jwt.verify(token, JWT_KEY);
}
module.exports = { sign, verify };

// keys.js - serve public key read-only
const express = require('express');
const router = express.Router();
const signer = require('../security/signer');

router.get('/public', (req, res) => {
  const pub = signer.loadPublicKey();
  res.type('text/plain').send(pub);
});

module.exports = router;

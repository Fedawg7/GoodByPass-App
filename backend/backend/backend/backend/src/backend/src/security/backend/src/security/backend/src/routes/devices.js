// devices.js - register and lookup devices
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwtHelpers = require('../security/jwt');

router.post('/register', (req, res) => {
  const { deviceId, owner, meta } = req.body;
  if (!deviceId || !owner) return res.status(400).json({ error: 'deviceId and owner required' });
  const createdAt = Date.now();
  db.run(
    `INSERT OR REPLACE INTO devices (id, owner, meta, created_at) VALUES (?, ?, ?, ?)`,
    [deviceId, owner, JSON.stringify(meta || {}), createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: 'db error', detail: err.message });
      const token = jwtHelpers.sign({ deviceId, owner });
      res.json({ deviceId, owner, token });
    }
  );
});

// middleware to protect routes
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing auth' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwtHelpers.verify(token);
    req.device = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

router.get('/me', authMiddleware, (req, res) => {
  const deviceId = req.device.deviceId;
  db.get(`SELECT * FROM devices WHERE id = ?`, [deviceId], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json({ device: { id: row.id, owner: row.owner, meta: JSON.parse(row.meta), created_at: row.created_at } });
  });
});

module.exports = router;

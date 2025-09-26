// updates.js - generate and serve signed manifest; store record
const express = require('express');
const router = express.Router();
const db = require('../db');
const signer = require('../security/signer');
const jwtHelpers = require('../security/jwt');

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

// Admin endpoint to create a new manifest (in prod restricted by RBAC)
router.post('/create', (req, res) => {
  // Example admin secret check — replace with proper RBAC in prod
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'forbidden' });
  const { version, packageUrl, packageHash, notes } = req.body;
  if (!version || !packageUrl || !packageHash) return res.status(400).json({ error: 'version, packageUrl, packageHash required' });

  const manifest = { version, packageUrl, packageHash, notes: notes || '', timestamp: new Date().toISOString() };
  const signature = signer.signJson(manifest);

  db.run(
    `INSERT INTO manifests (version, manifest_json, signature, created_at) VALUES (?, ?, ?, ?)`,
    [version, JSON.stringify(manifest), signature, Date.now()],
    function (err) {
      if (err) return res.status(500).json({ error: 'db error', detail: err.message });
      return res.json({ ok: true, manifest: manifest, signature });
    }
  );
});

// device fetch signed manifest (latest)
router.get('/manifest/latest', authMiddleware, (req, res) => {
  // Check device exists
  db.get(`SELECT id FROM devices WHERE id = ?`, [req.device.deviceId], (err, row) => {
    if (err) return res.status(500).json({ error: 'db error' });
    if (!row) return res.status(403).json({ error: 'unregistered device' });

    db.get(`SELECT * FROM manifests ORDER BY created_at DESC LIMIT 1`, [], (err2, mrow) => {
      if (err2) return res.status(500).json({ error: 'db error' });
      if (!mrow) return res.status(404).json({ error: 'no manifests' });
      return res.json({ manifest: JSON.parse(mrow.manifest_json), signature: mrow.signature });
    });
  });
});

module.exports = router;

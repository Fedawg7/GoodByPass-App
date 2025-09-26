const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function registerDevice(deviceId, owner, meta) {
  const res = await fetch(`${BASE}/devices/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, owner, meta })
  });
  return res.json();
}

export async function getManifest(token) {
  const res = await fetch(`${BASE}/updates/manifest/latest`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getPublicKey() {
  const res = await fetch(`${BASE}/keys/public`);
  return res.text();
}

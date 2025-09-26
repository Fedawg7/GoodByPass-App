import { useState } from 'react';
import { registerDevice } from '../utils/api';

export default function RegisterDevice({ onRegistered }) {
  const [deviceId, setDeviceId] = useState('');
  const [owner, setOwner] = useState('');
  async function handle() {
    const res = await registerDevice(deviceId || `device-${Date.now()}`, owner || 'owner@example.com', {});
    if (res.token) onRegistered(res);
    else alert(JSON.stringify(res));
  }
  return (
    <div>
      <h3>Register Device</h3>
      <input placeholder="deviceId" value={deviceId} onChange={e=>setDeviceId(e.target.value)} />
      <input placeholder="owner email" value={owner} onChange={e=>setOwner(e.target.value)} />
      <button onClick={handle}>Register</button>
    </div>
  );
}

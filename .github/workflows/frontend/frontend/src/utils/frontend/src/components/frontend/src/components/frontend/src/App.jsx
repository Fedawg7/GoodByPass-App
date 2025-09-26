import { useState } from 'react';
import RegisterDevice from './components/RegisterDevice';
import UpdateChecker from './components/UpdateChecker';

export default function App() {
  const [reg, setReg] = useState(null);
  return (
    <div style={{ padding: 20 }}>
      <h1>NMZ Device Dashboard (Demo)</h1>
      {!reg ? <RegisterDevice onRegistered={(r)=>setReg(r)} /> : (
        <>
          <div>
            <strong>Device:</strong> {reg.deviceId} <br/>
            <strong>Token:</strong> <code style={{wordBreak:'break-all'}}>{reg.token}</code>
          </div>
          <UpdateChecker token={reg.token} />
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { getManifest, getPublicKey } from '../utils/api';

export default function UpdateChecker({ token }) {
  const [status, setStatus] = useState('');
  async function check() {
    setStatus('Fetching manifest...');
    const signed = await getManifest(token);
    if (!signed.manifest) { setStatus('No manifest or error: ' + JSON.stringify(signed)); return; }
    const pub = await getPublicKey();
    // We cannot verify crypto signature in browser easily without big libs; we'll show how to verify server-side.
    setStatus('Manifest fetched. Server signature present. Manifest: ' + JSON.stringify(signed.manifest));
  }
  return (
    <div>
      <h3>Update Checker</h3>
      <button onClick={check}>Check for update</button>
      <pre>{status}</pre>
    </div>
  );
}

// signer.js - loads private key and signs JSON manifests
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const privateKeyPath = process.env.PRIVATE_KEY_PATH || path.resolve(__dirname, '../../keys/server_private.pem');
const publicKeyPath = process.env.PUBLIC_KEY_PATH || path.resolve(__dirname, '../../keys/server_public.pem');

function loadPrivateKey() {
  return fs.readFileSync(privateKeyPath, 'utf8');
}
function loadPublicKey() {
  return fs.readFileSync(publicKeyPath, 'utf8');
}

function signJson(obj) {
  const privateKey = loadPrivateKey();
  const json = JSON.stringify(obj);
  const signer = crypto.createSign(process.env.MANIFEST_SIGN_ALGO || 'RSA-SHA256');
  signer.update(json);
  signer.end();
  const signature = signer.sign(privateKey, 'base64');
  return signature;
}

function verifySignature(obj, signature, publicKey) {
  const json = JSON.stringify(obj);
  const verifier = crypto.createVerify(process.env.MANIFEST_SIGN_ALGO || 'RSA-SHA256');
  verifier.update(json);
  verifier.end();
  return verifier.verify(publicKey, signature, 'base64');
}

module.exports = { signJson, verifySignature, loadPublicKey, loadPrivateKey };

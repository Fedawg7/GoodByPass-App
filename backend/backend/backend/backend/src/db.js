// db.js - very small DB initializer using sqlite3 for demo
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/dev.db');

const db = new sqlite3.Database(dbPath);

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      owner TEXT,
      meta TEXT,
      created_at INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS manifests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT,
      manifest_json TEXT,
      signature TEXT,
      created_at INTEGER
    )`);
  });
}

if (require.main === module) {
  init();
  console.log('DB initialized at', dbPath);
}

module.exports = db;

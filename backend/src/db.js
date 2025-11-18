const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'ponto.sqlite');

async function openDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });
  await db.exec('PRAGMA foreign_keys = ON;');
  return db;
}

module.exports = { openDb, DB_FILE };
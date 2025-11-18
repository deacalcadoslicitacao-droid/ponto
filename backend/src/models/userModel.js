const { openDb } = require('../db');

async function createTablesIfNotExists() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','user'))
    );
    CREATE TABLE IF NOT EXISTS registros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('entrada','intervalo-saida','intervalo-volta','saida')), 
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await db.close();
}

async function findByEmail(email) {
  const db = await openDb();
  const row = await db.get('SELECT * FROM users WHERE email = ?', email);
  await db.close();
  return row;
}

async function findById(id) {
  const db = await openDb();
  const row = await db.get('SELECT id, name, email, role FROM users WHERE id = ?', id);
  await db.close();
  return row;
}

async function createUser({ name, email, password, role = 'user' }) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    name,
    email,
    password,
    role
  );
  const id = result.lastID;
  await db.close();
  return { id, name, email, role };
}

async function updateUser({ id, name, email, role }) {
  const db = await openDb();
  await db.run('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', name, email, role, id);
  await db.close();
  return { id, name, email, role };
}

async function deleteUser(id) {
  const db = await openDb();
  await db.run('DELETE FROM users WHERE id = ?', id);
  await db.close();
}

async function listUsers() {
  const db = await openDb();
  const rows = await db.all('SELECT id, name, email, role FROM users ORDER BY id DESC');
  await db.close();
  return rows;
}

module.exports = {
  createTablesIfNotExists,
  findByEmail,
  createUser,
  findById,
  updateUser,
  deleteUser,
  listUsers
};
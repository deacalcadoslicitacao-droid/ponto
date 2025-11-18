const { openDb } = require('../db');

async function createRegistro({ user_id, tipo, latitude, longitude, timestamp }) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO registros (user_id, tipo, latitude, longitude, timestamp) VALUES (?, ?, ?, ?, ?)',
    user_id,
    tipo,
    latitude,
    longitude,
    timestamp
  );
  const id = result.lastID;
  await db.close();
  return { id, user_id, tipo, latitude, longitude, timestamp };
}

async function getRegistrosByUserId(user_id) {
  const db = await openDb();
  const rows = await db.all(
    'SELECT r.id, r.user_id, r.tipo, r.latitude, r.longitude, r.timestamp, u.name, u.email FROM registros r JOIN users u ON r.user_id = u.id WHERE r.user_id = ? ORDER BY r.timestamp DESC',
    user_id
  );
  await db.close();
  return rows;
}

async function getRegistroById(id) {
  const db = await openDb();
  const row = await db.get('SELECT * FROM registros WHERE id = ?', id);
  await db.close();
  return row;
}

async function getRegistrosForCSV(user_id) {
  return await getRegistrosByUserId(user_id);
}

module.exports = {
  createRegistro,
  getRegistrosByUserId,
  getRegistroById,
  getRegistrosForCSV
};
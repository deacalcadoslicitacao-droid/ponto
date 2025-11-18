require('dotenv').config();
const bcrypt = require('bcrypt');
const { createTablesIfNotExists, findByEmail, createUser } = require('../src/models/userModel');

async function init() {
  try {
    await createTablesIfNotExists();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@empresa.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
    const ADMIN_NAME = 'Administrador';

    const existing = await findByEmail(ADMIN_EMAIL);
    if (existing) {
      console.log('Admin já existe:', ADMIN_EMAIL);
      return;
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const admin = await createUser({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hash, role: 'admin' });
    console.log('Admin criado:', admin);
  } catch (err) {
    console.error('Erro ao inicializar DB', err);
  }
}

init();
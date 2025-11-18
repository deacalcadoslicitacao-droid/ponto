const express = require('express');
const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/auth');
const { createUser, updateUser, deleteUser, listUsers, findByEmail } = require('../models/userModel');

const router = express.Router();

router.post('/user/create', authMiddleware('admin'), async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email e password são obrigatórios' });

    const exists = await findByEmail(email);
    if (exists) return res.status(400).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hash, role });
    res.status(201).json(user);
  } catch (err) {
    console.error('user create error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.put('/user/edit', authMiddleware('admin'), async (req, res) => {
  try {
    const { id, name, email, role } = req.body;
    if (!id || !name || !email || !role) return res.status(400).json({ error: 'id, name, email e role são obrigatórios' });

    const user = await updateUser({ id, name, email, role });
    res.json(user);
  } catch (err) {
    console.error('user edit error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.delete('/user/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    await deleteUser(id);
    res.json({ success: true });
  } catch (err) {
    console.error('user delete error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/users', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    console.error('list users error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
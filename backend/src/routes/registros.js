const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { createRegistro, getRegistrosByUserId, getRegistroById, getRegistrosForCSV } = require('../models/registroModel');
const { registrosToCsvString } = require('../utils/csv');

const router = express.Router();

router.post('/registro', authMiddleware(), async (req, res) => {
  try {
    const user = req.user;
    const { tipo, latitude, longitude, timestamp } = req.body;

    if (!tipo || !latitude || !longitude) {
      return res.status(400).json({ error: 'tipo, latitude e longitude são obrigatórios' });
    }

    const ts = timestamp || new Date().toISOString();

    const registro = await createRegistro({
      user_id: user.id,
      tipo,
      latitude,
      longitude,
      timestamp: ts
    });

    res.status(201).json(registro);
  } catch (err) {
    console.error('create registro error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/registros/:id', authMiddleware(), async (req, res) => {
  try {
    const requester = req.user;
    const id = req.params.id;

    if (requester.role !== 'admin' && Number(id) !== Number(requester.id)) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    const registros = await getRegistrosByUserId(id);
    res.json(registros);
  } catch (err) {
    console.error('get registros error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/registros/single/:id', authMiddleware(), async (req, res) => {
  try {
    const registro = await getRegistroById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro não encontrado' });

    if (req.user.role !== 'admin' && registro.user_id !== req.user.id) {
      return res.status(401).json({ error: 'Acesso negado' });
    }
    res.json(registro);
  } catch (err) {
    console.error('get registro by id error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/relatorio/:id/export-csv', authMiddleware('admin'), async (req, res) => {
  try {
    const id = req.params.id;
    const registros = await getRegistrosForCSV(id);
    const csv = registrosToCsvString(registros);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio_user_${id}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('export csv error', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
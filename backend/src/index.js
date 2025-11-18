require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const registroRoutes = require('./routes/registros');
const { createTablesIfNotExists } = require('./models/userModel');

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  await createTablesIfNotExists();
})();

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', registroRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota inexistente' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Erro interno' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
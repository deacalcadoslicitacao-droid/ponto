const jwt = require('jsonwebtoken');
const { findById } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authMiddleware(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Token não informado' });
      const parts = authHeader.split(' ');
      if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Token malformado' });

      let payload;
      try {
        payload = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
      }

      const user = await findById(payload.id);
      if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
      req.user = user;

      if (requiredRole) {
        if (requiredRole === 'admin' && user.role !== 'admin') {
          return res.status(401).json({ error: 'Acesso restrito a administradores' });
        }
      }

      next();
    } catch (err) {
      console.error('auth error', err);
      return res.status(500).json({ error: 'Erro no middleware de autenticação' });
    }
  };
}

module.exports = { authMiddleware };
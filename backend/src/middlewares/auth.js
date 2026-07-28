import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'plural_locacoes_jwt_secret_super_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token de autenticação não fornecido.' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
}

export function requireAdmin(req, res, next) {
  const role = req.user?.role || req.user?.roleCode;
  const allowedRoles = ['DEVELOPER', 'STORE_OWNER', 'OPERATOR', 'ADMIN'];

  if (!req.user || !allowedRoles.includes(role)) {
    return res.status(403).json({ error: 'Acesso negado. Requer privilégios administrativos.' });
  }
  next();
}

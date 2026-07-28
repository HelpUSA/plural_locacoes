import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'plural_locacoes_jwt_secret_super_key_2026';

export async function register(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let userRole = 'CLIENT';
    const emailLower = email.toLowerCase();
    if (emailLower === 'helpus.ecommerce@gmail.com' || emailLower === 'wagner.redes@gmail.com') {
      userRole = 'DEVELOPER';
    } else if (role === 'STORE_OWNER') {
      userRole = 'STORE_OWNER';
    } else if (role === 'OPERATOR') {
      userRole = 'OPERATOR';
    }

    const user = await prisma.user.create({
      data: {
        name,
        email: emailLower,
        password: hashedPassword,
        phone: phone || '',
        roleCode: userRole
      }
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.roleCode },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.roleCode, phone: user.phone }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.roleCode },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.roleCode, phone: user.phone, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

export async function loginGoogle(req, res) {
  try {
    const { email, name, picture, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail do Google é obrigatório.' });
    }

    const emailLower = email.toLowerCase();
    let user = await prisma.user.findUnique({ where: { email: emailLower } });

    if (!user) {
      let userRole = 'CLIENT';
      if (emailLower === 'helpus.ecommerce@gmail.com' || emailLower === 'wagner.redes@gmail.com') {
        userRole = 'DEVELOPER';
      }

      const randomPassword = await bcrypt.hash(`google_${Date.now()}_${Math.random()}`, 10);

      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email: emailLower,
          password: randomPassword,
          roleCode: userRole,
          googleId: googleId || `g-${Date.now()}`,
          avatarUrl: picture || ''
        }
      });
    } else {
      if (picture && !user.avatarUrl) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: picture, googleId: googleId || user.googleId }
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.roleCode },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.roleCode, phone: user.phone, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.error('Erro no login Google:', error);
    return res.status(500).json({ error: 'Erro ao autenticar com o Google.' });
  }
}

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, roleCode: true, phone: true, avatarUrl: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ user: { ...user, role: user.roleCode } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
}

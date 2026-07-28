import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        roleCode: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, phone, roleCode } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e E-mail são obrigatórios.' });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password || '@dmLocal1993', 10);
    const validRoles = ['DEVELOPER', 'STORE_OWNER', 'OPERATOR', 'CLIENT', 'ADMIN'];
    const role = validRoles.includes(roleCode) ? roleCode : 'CLIENT';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        roleCode: role
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { roleCode, name, phone, email } = req.body;

    const validRoles = ['CLIENT', 'ADMIN', 'LOGISTICS', 'DEVELOPER', 'STORE_OWNER', 'OPERATOR'];
    
    const updateData = {};
    if (roleCode && validRoles.includes(roleCode)) updateData.roleCode = roleCode;
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email) updateData.email = email.toLowerCase();

    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Evitar deletar a si mesmo se for o único SuperAdmin
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (userToDelete?.email === 'helpus.ecommerce@gmail.com') {
      return res.status(400).json({ error: 'A conta SuperAdmin Principal não pode ser excluída.' });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
}

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

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { roleCode } = req.body;

    const validRoles = ['CLIENT', 'ADMIN', 'LOGISTICS'];
    if (!validRoles.includes(roleCode)) {
      return res.status(400).json({ error: 'Perfil de usuário inválido.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { roleCode }
    });

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
}

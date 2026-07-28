import { prisma } from '../config/db.js';

export async function getMaintenanceLogs(req, res) {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' }
    });

    return res.json({ logs, suppliers });
  } catch (error) {
    console.error('Erro ao buscar registros de manutenção:', error);
    return res.status(500).json({ error: 'Erro ao carregar manutenções.' });
  }
}

export async function createMaintenanceLog(req, res) {
  try {
    const { productId, quantity, issueDescription, cost } = req.body;

    if (!productId || !issueDescription) {
      return res.status(400).json({ error: 'Produto e descrição do problema são obrigatórios.' });
    }

    const log = await prisma.maintenanceLog.create({
      data: {
        productId,
        quantity: parseInt(quantity, 10) || 1,
        issueDescription,
        cost: parseFloat(cost) || 0,
        status: 'IN_REPAIR'
      },
      include: { product: true }
    });

    // Registrar o custo da manutenção no financeiro se houver custo
    if (parseFloat(cost) > 0) {
      await prisma.financialTransaction.create({
        data: {
          description: `Manutenção Acervo: ${log.product.name}`,
          amount: parseFloat(cost),
          type: 'EXPENSE',
          category: 'MANUTENCAO',
          status: 'PAID'
        }
      });
    }

    return res.status(201).json(log);
  } catch (error) {
    console.error('Erro ao registrar manutenção:', error);
    return res.status(500).json({ error: 'Erro ao registrar manutenção.' });
  }
}

export async function updateMaintenanceStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // "IN_REPAIR", "RESOLVED", "DISCARDED"

    const updated = await prisma.maintenanceLog.update({
      where: { id },
      data: { status }
    });

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar status da manutenção:', error);
    return res.status(500).json({ error: 'Erro ao atualizar manutenção.' });
  }
}

export async function createSupplier(req, res) {
  try {
    const { name, contactPerson, phone, email, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome do fornecedor é obrigatório.' });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        phone,
        email,
        category: category || 'GERAL'
      }
    });

    return res.status(201).json(supplier);
  } catch (error) {
    console.error('Erro ao cadastrar fornecedor:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar fornecedor.' });
  }
}

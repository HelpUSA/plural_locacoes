import { prisma } from '../config/db.js';

export async function getFinancialSummary(req, res) {
  try {
    const transactions = await prisma.financialTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'INCOME') totalIncome += t.amount;
      if (t.type === 'EXPENSE') totalExpense += t.amount;
    });

    const netProfit = totalIncome - totalExpense;

    return res.json({
      totalIncome,
      totalExpense,
      netProfit,
      transactionsCount: transactions.length,
      recentTransactions: transactions.slice(0, 10)
    });
  } catch (error) {
    console.error('Erro ao buscar resumo financeiro:', error);
    return res.status(500).json({ error: 'Erro ao carregar dados financeiros.' });
  }
}

export async function getFinancialTransactions(req, res) {
  try {
    const { type } = req.query;
    const where = {};
    if (type) where.type = type;

    const transactions = await prisma.financialTransaction.findMany({
      where,
      include: { order: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações financeiras:', error);
    return res.status(500).json({ error: 'Erro ao carregar lançamentos financeiras.' });
  }
}

export async function createFinancialTransaction(req, res) {
  try {
    const { description, amount, type, category, dueDate, status } = req.body;

    if (!description || !amount || !type) {
      return res.status(400).json({ error: 'Descrição, valor e tipo são obrigatórios.' });
    }

    const transaction = await prisma.financialTransaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type, // "INCOME" ou "EXPENSE"
        category: category || 'GERAL',
        dueDate: dueDate || null,
        paidDate: status === 'PAID' ? new Date().toISOString() : null,
        status: status || 'PAID'
      }
    });

    return res.status(201).json(transaction);
  } catch (error) {
    console.error('Erro ao criar lançamento financeiro:', error);
    return res.status(500).json({ error: 'Erro ao registrar lançamento financeiro.' });
  }
}

import { prisma } from '../config/db.js';

export async function createOrder(req, res) {
  try {
    const {
      clientName,
      whatsapp,
      startDate,
      endDate,
      rentalDays,
      neighborhood,
      address,
      reference,
      notes,
      items,
      subtotal,
      freightFee,
      totalPrice
    } = req.body;

    if (!clientName || !whatsapp || !items || items.length === 0) {
      return res.status(400).json({ error: 'Dados do cliente e itens são obrigatórios.' });
    }

    const userId = req.user ? req.user.id : null;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${new Date().getFullYear()}-${randomNum}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        clientName,
        whatsapp,
        startDate: startDate || '',
        endDate: endDate || '',
        rentalDays: rentalDays || 1,
        neighborhood: neighborhood || 'Geral',
        address: address || '',
        reference: reference || '',
        notes: notes || '',
        status: 'PENDING',
        subtotal: parseFloat(subtotal) || 0,
        freightFee: parseFloat(freightFee) || 0,
        totalPrice: parseFloat(totalPrice) || 0,
        items: {
          create: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantidade,
            unitPrice: item.precoUnitarioDiaria,
            addOns: JSON.stringify(item.opcoesSelecionadas || [])
          }))
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            comment: 'Solicitação de locação registrada 100% via Web'
          }
        }
      },
      include: {
        items: {
          include: { product: true }
        },
        statusHistory: true
      }
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ error: 'Erro ao registrar solicitação de locação.' });
  }
}

export async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar meus pedidos:', error);
    return res.status(500).json({ error: 'Erro ao buscar histórico de pedidos.' });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(orders);
  } catch (error) {
    console.error('Erro ao listar todos os pedidos (Admin):', error);
    return res.status(500).json({ error: 'Erro ao listar solicitações de locação.' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const validStatuses = ['PENDING', 'APPROVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'RETURNED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status de locação inválido.' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            comment: comment || `Status alterado para ${status}`
          }
        }
      },
      include: {
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
}

import { prisma } from '../config/db.js';

export async function getTopProductsReport(req, res) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: { product: true }
    });

    const productMap = {};

    orderItems.forEach(item => {
      const pId = item.productId;
      const pName = item.product ? item.product.name : 'Equipamento';
      const qty = item.quantity || 1;
      const totalVal = (item.unitPrice || 0) * qty;

      if (!productMap[pId]) {
        productMap[pId] = {
          id: pId,
          name: pName,
          totalRentedQuantity: 0,
          totalRevenue: 0,
          image: item.product ? item.product.image : ''
        };
      }

      productMap[pId].totalRentedQuantity += qty;
      productMap[pId].totalRevenue += totalVal;
    });

    const reportList = Object.values(productMap).sort((a, b) => b.totalRentedQuantity - a.totalRentedQuantity);

    return res.json(reportList);
  } catch (error) {
    console.error('Erro ao gerar relatório de produtos mais alugados:', error);
    return res.status(500).json({ error: 'Erro ao gerar relatório de produtos.' });
  }
}

export async function getNeighborhoodRevenueReport(req, res) {
  try {
    const orders = await prisma.order.findMany();
    const neighborhoodMap = {};

    orders.forEach(order => {
      const neighborhood = order.neighborhood || 'Geral';
      const val = order.totalPrice || 0;

      if (!neighborhoodMap[neighborhood]) {
        neighborhoodMap[neighborhood] = {
          neighborhood,
          ordersCount: 0,
          totalRevenue: 0
        };
      }

      neighborhoodMap[neighborhood].ordersCount += 1;
      neighborhoodMap[neighborhood].totalRevenue += val;
    });

    const reportList = Object.values(neighborhoodMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return res.json(reportList);
  } catch (error) {
    console.error('Erro ao gerar relatório de faturamento por bairro:', error);
    return res.status(500).json({ error: 'Erro ao gerar relatório de bairros.' });
  }
}

export async function getOccupancyStats(req, res) {
  try {
    const totalProductsCount = await prisma.product.count();
    const activeOrdersCount = await prisma.order.count({
      where: {
        status: { in: ['APPROVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'] }
      }
    });

    const maintenanceLogsCount = await prisma.maintenanceLog.count({
      where: { status: 'IN_REPAIR' }
    });

    return res.json({
      totalProductsCount,
      activeOrdersCount,
      maintenanceLogsCount,
      occupancyRatePercent: totalProductsCount > 0 ? Math.min(100, Math.round((activeOrdersCount / totalProductsCount) * 100)) : 0
    });
  } catch (error) {
    console.error('Erro ao buscar taxa de ocupação:', error);
    return res.status(500).json({ error: 'Erro ao calcular ocupação.' });
  }
}

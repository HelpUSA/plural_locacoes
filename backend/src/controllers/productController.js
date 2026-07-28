import { prisma } from '../config/db.js';

export async function getProducts(req, res) {
  try {
    const { category, department, group, search, isKit } = req.query;

    const where = { status: 'ACTIVE' };

    if (category && category !== 'todos') {
      where.OR = [
        { category: { slug: category } },
        { categoryId: category }
      ];
    }

    if (department) {
      where.department = { slug: department };
    }

    if (group) {
      where.group = { slug: group };
    }

    if (isKit === 'true') {
      where.isKit = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
        { color: { contains: search } },
        { material: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        department: true,
        category: true,
        group: true,
        addons: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao carregar o catálogo de produtos.' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        department: true,
        category: true,
        group: true,
        addons: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    return res.status(500).json({ error: 'Erro ao carregar detalhes do produto.' });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      sku,
      name,
      departmentId,
      categoryId,
      groupId,
      priceDaily,
      priceWeekly,
      image,
      galleryJSON,
      description,
      color,
      material,
      dimensions,
      maxWeight,
      specsJSON,
      stock,
      highlight,
      isKit,
      addons
    } = req.body;

    if (!name || !priceDaily) {
      return res.status(400).json({ error: 'Nome e Preço por Diária são obrigatórios.' });
    }

    const generatedSku = sku || `SKU-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        sku: generatedSku,
        name,
        departmentId,
        categoryId,
        groupId,
        priceDaily: parseFloat(priceDaily),
        priceWeekly: priceWeekly ? parseFloat(priceWeekly) : null,
        image: image || '/mesas-e-cadeiras-01.jpeg',
        galleryJSON: galleryJSON ? JSON.stringify(galleryJSON) : null,
        description: description || '',
        color: color || '',
        material: material || '',
        dimensions: dimensions || '',
        maxWeight: maxWeight || '',
        specsJSON: typeof specsJSON === 'object' ? JSON.stringify(specsJSON) : specsJSON,
        stock: parseInt(stock, 10) || 50,
        highlight: highlight || '',
        isKit: !!isKit,
        addons: addons && addons.length > 0 ? {
          create: addons.map(a => ({ name: a.name, price: parseFloat(a.price) }))
        } : undefined
      },
      include: { addons: true }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar equipamento.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        priceDaily: data.priceDaily ? parseFloat(data.priceDaily) : undefined,
        priceWeekly: data.priceWeekly ? parseFloat(data.priceWeekly) : undefined,
        image: data.image,
        description: data.description,
        color: data.color,
        material: data.material,
        dimensions: data.dimensions,
        maxWeight: data.maxWeight,
        stock: data.stock ? parseInt(data.stock, 10) : undefined,
        highlight: data.highlight,
        isKit: data.isKit
      }
    });

    return res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Equipamento excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return res.status(500).json({ error: 'Erro ao excluir equipamento.' });
  }
}

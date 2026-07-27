import { prisma } from '../config/db.js';

export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao listar produtos.' });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar detalhes do produto.' });
  }
}

export async function createProduct(req, res) {
  try {
    const { nome, categoria, precoDiaria, imagem, descricao, highlight, estoque } = req.body;

    if (!nome || !categoria || precoDiaria === undefined) {
      return res.status(400).json({ error: 'Nome, categoria e preço diária são obrigatórios.' });
    }

    const product = await prisma.product.create({
      data: {
        nome,
        categoria,
        precoDiaria: parseFloat(precoDiaria),
        imagem: imagem || '/mesas-e-cadeiras-01.jpeg',
        descricao: descricao || '',
        highlight: highlight || '',
        estoque: parseInt(estoque, 10) || 50
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro ao cadastrar produto.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { nome, categoria, precoDiaria, imagem, descricao, highlight, estoque } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(categoria && { categoria }),
        ...(precoDiaria !== undefined && { precoDiaria: parseFloat(precoDiaria) }),
        ...(imagem && { imagem }),
        ...(descricao !== undefined && { descricao }),
        ...(highlight !== undefined && { highlight }),
        ...(estoque !== undefined && { estoque: parseInt(estoque, 10) })
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
    return res.json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ error: 'Erro ao remover produto.' });
  }
}

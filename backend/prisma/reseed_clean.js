import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Limpando produtos antigos e re-seemeando taxonomia corporativa...');

  await prisma.productAddon.deleteMany({});
  await prisma.product.deleteMany({});

  // 1. Departamentos
  const departmentsData = [
    { name: 'Mobiliário & Lounges', slug: 'mobiliario-lounges', icon: '🪑' },
    { name: 'Estruturas & Climatização', slug: 'estruturas-climatizacao', icon: '⛺' },
    { name: 'Gastronomia & Enxoval', slug: 'gastronomia-enxoval', icon: '🥼' },
    { name: 'Kits & Sugestões de Ambientes', slug: 'kits-ambientes', icon: '📦' }
  ];

  const depMap = {};
  for (const d of departmentsData) {
    const dep = await prisma.department.upsert({
      where: { slug: d.slug },
      update: d,
      create: d
    });
    depMap[d.slug] = dep.id;
  }

  // 2. Categorias
  const categoriesData = [
    { name: 'Assentos & Cadeiras', slug: 'assentos-cadeiras', icon: '🪑', departmentId: depMap['mobiliario-lounges'] },
    { name: 'Mesas & Bancadas', slug: 'mesas-bancadas', icon: '🪵', departmentId: depMap['mobiliario-lounges'] },
    { name: 'Tendas & Pistas', slug: 'tendas-pistas', icon: '⛺', departmentId: depMap['estruturas-climatizacao'] },
    { name: 'Climatização & Iluminação', slug: 'climatizacao-iluminacao', icon: '💡', departmentId: depMap['estruturas-climatizacao'] },
    { name: 'Mesa Posta & Panaria', slug: 'mesa-posta-panaria', icon: '🍽️', departmentId: depMap['gastronomia-enxoval'] },
    { name: 'Combos & Kits Prontos', slug: 'combos-kits-prontos', icon: '🎁', departmentId: depMap['kits-ambientes'] }
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c
    });
    catMap[c.slug] = cat.id;
  }

  // 3. Grupos
  const groupsData = [
    { name: 'Cadeiras Plásticas / Monobloco', slug: 'cadeiras-plasticas', categoryId: catMap['assentos-cadeiras'] },
    { name: 'Cadeiras Nobres & Eventos', slug: 'cadeiras-nobres', categoryId: catMap['assentos-cadeiras'] },
    { name: 'Mesas Redondas Sociais', slug: 'mesas-redondas', categoryId: catMap['mesas-bancadas'] },
    { name: 'Mesas Retangulares de Buffet', slug: 'mesas-retangulares', categoryId: catMap['mesas-bancadas'] },
    { name: 'Tendas Piramidais', slug: 'tendas-piramidais', categoryId: catMap['tendas-pistas'] },
    { name: 'Kits para Festas & Praia', slug: 'kits-festas-praia', categoryId: catMap['combos-kits-prontos'] }
  ];

  const grpMap = {};
  for (const g of groupsData) {
    const grp = await prisma.group.upsert({
      where: { slug: g.slug },
      update: g,
      create: g
    });
    grpMap[g.slug] = grp.id;
  }

  // 4. Produtos com SKUs e Fichas Técnicas
  const products = [
    {
      sku: 'CAD-PLAST-PR-01',
      name: 'Cadeira Plástica Preta Reforçada (INMETRO)',
      departmentId: depMap['mobiliario-lounges'],
      categoryId: catMap['assentos-cadeiras'],
      groupId: grpMap['cadeiras-plasticas'],
      priceDaily: 5.0,
      priceWeekly: 20.0,
      image: '/cadeira-preta.jpg',
      galleryJSON: JSON.stringify(['/cadeira-preta.jpg']),
      description: 'Cadeira plástica monobloco preta, anatômica, empilhável e de higienização simples. Mantida em estado de nova.',
      color: 'Preta Fosca',
      material: 'Polipropileno 100% Virgem',
      dimensions: '42cm (L) x 88cm (A) x 45cm (P)',
      maxWeight: 'Resistência até 182 kg',
      specsJSON: JSON.stringify({
        'Empilhamento': 'Até 20 unidades com segurança',
        'Certificação': 'INMETRO Aprovado',
        'Uso Recomendado': 'Praia, Churrasco, Eventos Externos'
      }),
      stock: 350,
      highlight: 'Design anatômico e resistência extrema',
      status: 'ACTIVE',
      addons: [
        { name: 'Capa em Spandex / Tecido Preto', price: 7.0 }
      ]
    },
    {
      sku: 'CAD-PLAST-BR-01',
      name: 'Cadeira Plástica Branca Reforçada',
      departmentId: depMap['mobiliario-lounges'],
      categoryId: catMap['assentos-cadeiras'],
      groupId: grpMap['cadeiras-plasticas'],
      priceDaily: 5.0,
      priceWeekly: 20.0,
      image: '/cadeira-branca.jpg',
      galleryJSON: JSON.stringify(['/cadeira-branca.jpg']),
      description: 'Cadeira branca higienizada com acabamento limpo. Combina com capas de tecido e decorações de alto padrão.',
      color: 'Branca Clean',
      material: 'Polipropileno Reforçado UV',
      dimensions: '42cm (L) x 88cm (A) x 45cm (P)',
      maxWeight: 'Resistência até 150 kg',
      specsJSON: JSON.stringify({
        'Empilhamento': 'Até 20 unidades',
        'Uso Recomendado': 'Recepções, Festas de Aniversário, Batizados'
      }),
      stock: 400,
      highlight: 'Clean e elegante para qualquer ambientação',
      status: 'ACTIVE',
      addons: [
        { name: 'Capa de Tecido Branca com Laço', price: 8.0 }
      ]
    },
    {
      sku: 'MES-RED-120-01',
      name: 'Mesa Redonda 1,20m em MDF Nobre',
      departmentId: depMap['mobiliario-lounges'],
      categoryId: catMap['mesas-bancadas'],
      groupId: grpMap['mesas-redondas'],
      priceDaily: 40.0,
      priceWeekly: 180.0,
      image: '/mesas-e-cadeiras-01.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-01.jpeg', '/imagem01.jpg']),
      description: 'Mesa redonda em MDF resistente de 15mm com bordas seladas e pés metálicos com travamento de segurança. Acomoda confortavelmente 8 lugares.',
      color: 'Madeira Natural / Pés Pretos',
      material: 'MDF Nobre com Estrutura de Aço Carbono',
      dimensions: '1,20m (Diâmetro) x 75cm (Altura)',
      maxWeight: 'Suporta até 100 kg distribuídos',
      specsJSON: JSON.stringify({
        'Capacidade': '8 Pessoas Sentadas',
        'Travamento': 'Pés Dobráveis de Pressão',
        'Uso': 'Jantares, Casamentos, Banquetes'
      }),
      stock: 40,
      highlight: '🔥 Campeã de locações para casamentos e banquetes',
      status: 'ACTIVE',
      addons: [
        { name: 'Toalha Branca em Oxford (até o chão)', price: 30.0 },
        { name: 'Cobre-Mancha Champanhe / Dourado', price: 20.0 },
        { name: 'Arranjo de Mesa Decorativo', price: 45.0 }
      ]
    },
    {
      sku: 'MES-RET-200-01',
      name: 'Mesa Retangular de Buffet 2,00m',
      departmentId: depMap['mobiliario-lounges'],
      categoryId: catMap['mesas-bancadas'],
      groupId: grpMap['mesas-retangulares'],
      priceDaily: 40.0,
      priceWeekly: 180.0,
      image: '/mesas-e-cadeiras-03.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-03.jpeg', '/imagem04.jpg']),
      description: 'Mesa retangular versátil para área de buffet, coffee break, apoio de bebidas, doces e recepção de convidados.',
      color: 'Madeira Compensado',
      material: 'Compensado Naval Reforçado',
      dimensions: '2,00m (C) x 0,90m (L) x 0,75m (A)',
      maxWeight: 'Suporta até 120 kg',
      specsJSON: JSON.stringify({
        'Aplicação': 'Área de Alimentos, Bar, Doces',
        'Estrutura': 'Metálica Reforçada'
      }),
      stock: 25,
      highlight: 'Indispensável para área de alimentos e bar',
      status: 'ACTIVE',
      addons: [
        { name: 'Toalha Retangular Branca de Buffet (3m)', price: 35.0 },
        { name: 'Saia de Mesa Plissada Branca', price: 25.0 }
      ]
    },
    {
      sku: 'TEN-PIR-6X6-01',
      name: 'Tenda Piramidal 6x6m Chapéu de Bruxa (36m²)',
      departmentId: depMap['estruturas-climatizacao'],
      categoryId: catMap['tendas-pistas'],
      groupId: grpMap['tendas-piramidais'],
      priceDaily: 350.0,
      priceWeekly: 1200.0,
      image: '/Tenda-6x6-branca.jpg',
      galleryJSON: JSON.stringify(['/Tenda-6x6-branca.jpg']),
      description: 'Tenda profissional tipo Chapéu de Bruxa para cobertura de grandes áreas. Acompanha transporte, montagem profissional, estaiamento e desmontagem inclusos.',
      color: 'Lona Branca Vinílica',
      material: 'Aço Galvanizado Anticorrosivo e Lona PVC UV',
      dimensions: '6,00m x 6,00m (36 m² de Cobertura)',
      maxWeight: 'Resistência a Ventos até 60km/h',
      specsJSON: JSON.stringify({
        'Capacidade': 'Acomoda até 40 pessoas sentadas ou 60 em pé',
        'Montagem': 'Inclusa pela equipe técnica Plural'
      }),
      stock: 12,
      highlight: '☔ Proteção total contra chuva e sol com montagem inclusa',
      status: 'ACTIVE',
      addons: [
        { name: 'Fechamento Lateral de Parede com Janela Transparente', price: 80.0 },
        { name: 'Kit Iluminação Spot LED 400W para Tenda', price: 120.0 },
        { name: 'Climatizador Evaporativo de Ar Industrial', price: 200.0 }
      ]
    },
    {
      sku: 'KIT-PRAIA-CHURR-50',
      name: 'Kit Lounge Praia & Churrasco (Combo 50 Pessoas)',
      departmentId: depMap['kits-ambientes'],
      categoryId: catMap['combos-kits-prontos'],
      groupId: grpMap['kits-festas-praia'],
      priceDaily: 480.0,
      priceWeekly: 1700.0,
      image: '/mesas-e-cadeiras-02.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-02.jpeg', '/Tenda-6x6-branca.jpg']),
      description: 'Combo de ambientação completo para 50 pessoas: 1 Tenda Piramidal 6x6m + 10 Mesas Quadradas Plásticas + 40 Cadeiras Plásticas Reforçadas.',
      color: 'Conjunto Branco e Preto',
      material: 'Lona PVC + Polipropileno Virgem',
      dimensions: '36m² de Área de Evento',
      maxWeight: 'Combo Completo',
      specsJSON: JSON.stringify({
        'Composição': '1 Tenda 6x6m + 10 Mesas + 40 Cadeiras',
        'Economia': 'Economize R$ 120,00 no combo comparado aos itens avulsos'
      }),
      stock: 10,
      highlight: '⭐ Campeão de Vendas para Aniversários e Churrascos',
      isKit: true,
      status: 'ACTIVE',
      addons: [
        { name: '10 Toalhas Quadradas de Mesa', price: 100.0 }
      ]
    }
  ];

  for (const p of products) {
    const { addons, ...prodData } = p;
    const createdProd = await prisma.product.create({
      data: prodData
    });

    if (addons && addons.length > 0) {
      for (const add of addons) {
        await prisma.productAddon.create({
          data: {
            productId: createdProd.id,
            name: add.name,
            price: add.price
          }
        });
      }
    }
  }

  console.log('✅ Produtos re-seemeados com SKUs e taxonomia completa!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no reseed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

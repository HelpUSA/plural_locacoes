import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seeding com Níveis de Acesso (DEVELOPER, STORE_OWNER, OPERATOR, CLIENT)...');

  // 1. Criar Roles (Perfis de Acesso Multi-Nível)
  const roles = [
    { code: 'DEVELOPER', name: 'Desenvolvedor & Admin Geral', description: 'Acesso total irrestrito a todas as lojas, configs globais e desenvolvedor' },
    { code: 'STORE_OWNER', name: 'Dono / Gerente da Loja', description: 'Gestão da loja, catálogo, financeiro, relatórios e operadores' },
    { code: 'OPERATOR', name: 'Operador / Funcionário', description: 'Operação de catálogo, estoque, romaneios e status de entregas' },
    { code: 'CLIENT', name: 'Cliente Final', description: 'Realiza locações 100% web, visualiza histórico e comprovantes' }
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: r,
      create: r
    });
  }
  console.log('✅ 4 Níveis de acesso (Roles) configurados.');

  // 2. Criar Usuários Iniciais por Nível
  const hashDevPassword = await bcrypt.hash('@dmLocal1993', 10);
  const hashOwnerPassword = await bcrypt.hash('gerente123', 10);
  const hashOperatorPassword = await bcrypt.hash('operador123', 10);
  const hashClientPassword = await bcrypt.hash('cliente123', 10);

  // 👑 DEVELOPER (SuperAdmin / Dev Geral)
  const devUser = await prisma.user.upsert({
    where: { email: 'helpus.ecommerce@gmail.com' },
    update: {
      password: hashDevPassword,
      roleCode: 'DEVELOPER'
    },
    create: {
      name: 'Wagner (Desenvolvedor Geral)',
      email: 'helpus.ecommerce@gmail.com',
      password: hashDevPassword,
      phone: '(83) 99908-7188',
      roleCode: 'DEVELOPER'
    }
  });

  // 🏬 STORE_OWNER (Gerente Plural Locações)
  const ownerUser = await prisma.user.upsert({
    where: { email: 'gerente@plurallocacoes.com.br' },
    update: {},
    create: {
      name: 'Júlio (Gerente Plural)',
      email: 'gerente@plurallocacoes.com.br',
      password: hashOwnerPassword,
      phone: '(83) 99908-7188',
      roleCode: 'STORE_OWNER'
    }
  });

  // 🛠️ OPERATOR (Operador de Estoque/Entrega)
  const operatorUser = await prisma.user.upsert({
    where: { email: 'operador@plurallocacoes.com.br' },
    update: {},
    create: {
      name: 'Carlos (Operador Logístico)',
      email: 'operador@plurallocacoes.com.br',
      password: hashOperatorPassword,
      phone: '(83) 98888-1111',
      roleCode: 'OPERATOR'
    }
  });

  // 👤 CLIENT (Cliente Final)
  const clientUser = await prisma.user.upsert({
    where: { email: 'cliente@exemplo.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'cliente@exemplo.com',
      password: hashClientPassword,
      phone: '(83) 98888-7777',
      roleCode: 'CLIENT',
      addresses: {
        create: [
          {
            street: 'Av. Epitácio Pessoa',
            number: '1250',
            neighborhood: 'Tambaú / Cabo Branco / Manaíra',
            city: 'João Pessoa',
            state: 'PB',
            isDefault: true
          }
        ]
      }
    }
  });

  console.log('✅ Usuários cadastrados: SuperAdmin Dev (helpus.ecommerce@gmail.com), Gerente, Operador e Cliente.');

  // 3. Criar Categorias
  const categories = [
    { name: 'Mesas', slug: 'mesas', icon: '🪑' },
    { name: 'Cadeiras', slug: 'cadeiras', icon: '🪑' },
    { name: 'Kits & Conjuntos', slug: 'conjuntos', icon: '📦' },
    { name: 'Tendas & Coberturas', slug: 'tendas', icon: '⛺' },
    { name: 'Enxoval & Toalhas', slug: 'enxoval', icon: '🥼' },
    { name: 'Iluminação & Climatização', slug: 'iluminacao-climatizacao', icon: '💡' }
  ];

  const catMap = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c
    });
    catMap[c.slug] = cat.id;
  }

  // 4. Criar Produtos com Especificações, Galerias e Opcionais
  const initialProducts = [
    {
      name: 'Mesa Redonda 1,20m em MDF Nobre',
      categoryId: catMap['mesas'],
      priceDaily: 40.0,
      priceWeekly: 180.0,
      image: '/mesas-e-cadeiras-01.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-01.jpeg', '/imagem01.jpg', '/imagem02.jpg']),
      description: 'Mesa redonda em MDF resistente de 15mm com bordas seladas e pés metálicos com travamento de segurança. Acomoda confortavelmente 8 lugares. Perfeita para jantares, aniversários e casamentos.',
      specsJSON: JSON.stringify({
        'Diâmetro': '1,20 metros',
        'Altura': '75 cm',
        'Capacidade': 'Até 8 pessoas',
        'Material': 'MDF com estrutura de aço carbono',
        'Uso Recomendado': 'Recepções, Buffets, Casamentos'
      }),
      stock: 40,
      highlight: '🔥 Campeã de locações para casamentos e banquetes',
      status: 'ACTIVE',
      addons: [
        { name: 'Toalha Branca em Oxford (até o chão)', price: 30.0 },
        { name: 'Cobre-Mancha Champanhe / Dourado', price: 20.0 },
        { name: 'Arranjo de Mesa Decorativo (Consultar flores)', price: 45.0 }
      ]
    },
    {
      name: 'Conjunto Mesa Quadrada + 4 Cadeiras Plásticas',
      categoryId: catMap['conjuntos'],
      priceDaily: 20.0,
      priceWeekly: 90.0,
      image: '/mesas-e-cadeiras-02.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-02.jpeg', '/imagem03.jpg']),
      description: 'Kit prático composto por 1 mesa quadrada de plástico reforçado e 4 cadeiras de alta qualidade. Ideal para praias, churrascos, festas infantis e reuniões de família.',
      specsJSON: JSON.stringify({
        'Composição': '1 Mesa Quadrada + 4 Cadeiras sem braço',
        'Material': 'Polipropileno injetado com proteção UV',
        'Dimensões da Mesa': '70cm x 70cm x 72cm',
        'Resistência Cadeira': 'Certificada pelo INMETRO até 182kg'
      }),
      stock: 120,
      highlight: '⭐ Excelente opção econômica para churrascos e praia',
      status: 'ACTIVE',
      addons: [
        { name: 'Toalha Quadrada para Mesa Plástica', price: 15.0 }
      ]
    },
    {
      name: 'Mesa Retangular de Buffet 2,00m',
      categoryId: catMap['mesas'],
      priceDaily: 40.0,
      priceWeekly: 180.0,
      image: '/mesas-e-cadeiras-03.jpeg',
      galleryJSON: JSON.stringify(['/mesas-e-cadeiras-03.jpeg', '/imagem04.jpg']),
      description: 'Mesa retangular versátil para área de buffet, coffee break, apoio de bebidas, doces e recepção de convidados.',
      specsJSON: JSON.stringify({
        'Dimensões': '2,00m de comprimento x 0,90m de largura x 0,75m de altura',
        'Material': 'Tampo em compensado naval reforçado',
        'Capacidade de Carga': 'Até 120kg distribuídos'
      }),
      stock: 25,
      highlight: 'Indispensável para área de alimentos e bar',
      status: 'ACTIVE',
      addons: [
        { name: 'Toalha Retangular Branca de Buffet (3 metros)', price: 35.0 },
        { name: 'Saia de Mesa Plissada Branca', price: 25.0 }
      ]
    },
    {
      name: 'Cadeira Plástica Preta Reforçada (INMETRO)',
      categoryId: catMap['cadeiras'],
      priceDaily: 5.0,
      priceWeekly: 20.0,
      image: '/cadeira-preta.jpg',
      galleryJSON: JSON.stringify(['/cadeira-preta.jpg']),
      description: 'Cadeira plástica monobloco preta, anatômica, empilhável e de higienização simples. Mantida em estado de nova.',
      specsJSON: JSON.stringify({
        'Cor': 'Preta fosca',
        'Material': 'Polipropileno 100% virgem',
        'Resistência': 'Testada e aprovada até 182kg',
        'Empilhamento': 'Até 20 unidades de forma segura'
      }),
      stock: 350,
      highlight: 'Design anatômico e resistência extrema',
      status: 'ACTIVE',
      addons: [
        { name: 'Capa em Spandex / Tecido Preto', price: 7.0 }
      ]
    },
    {
      name: 'Cadeira Plástica Branca Reforçada',
      categoryId: catMap['cadeiras'],
      priceDaily: 5.0,
      priceWeekly: 20.0,
      image: '/cadeira-branca.jpg',
      galleryJSON: JSON.stringify(['/cadeira-branca.jpg']),
      description: 'Cadeira branca higienizada com acabamento limpo. Combina com capas de tecido e decorações de alto padrão.',
      specsJSON: JSON.stringify({
        'Cor': 'Branca',
        'Material': 'Polipropileno reforçado',
        'Resistência': 'Até 150kg'
      }),
      stock: 400,
      highlight: 'Clean e elegante para qualquer ambientação',
      status: 'ACTIVE',
      addons: [
        { name: 'Capa de Tecido Branca com Laço', price: 8.0 }
      ]
    },
    {
      name: 'Tenda Piramidal 6x6m Chapéu de Bruxa (36m²)',
      categoryId: catMap['tendas'],
      priceDaily: 350.0,
      priceWeekly: 1200.0,
      image: '/Tenda-6x6-branca.jpg',
      galleryJSON: JSON.stringify(['/Tenda-6x6-branca.jpg']),
      description: 'Tenda profissional tipo Chapéu de Bruxa para cobertura de grandes áreas. Acompanha transporte, montagem profissional, estaiamento e desmontagem inclusos.',
      specsJSON: JSON.stringify({
        'Área Coberta': '36 metros quadrados (6m x 6m)',
        'Capacidade': 'Acomoda até 40 pessoas sentadas ou 60 em pé',
        'Estrutura': 'Aço carbono galvanizado anticorrosivo',
        'Lona': 'PVC vinílico antichamas com proteção térmica UV'
      }),
      stock: 12,
      highlight: '☔ Proteção total contra chuva e sol com montagem inclusa',
      status: 'ACTIVE',
      addons: [
        { name: 'Fechamento Lateral de Parede com Janela Transparente', price: 80.0 },
        { name: 'Kit Iluminação Spot LED 400W para Tenda', price: 120.0 },
        { name: 'Climatizador Evaporativo de Ar Industrial', price: 200.0 }
      ]
    }
  ];

  for (const p of initialProducts) {
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

  console.log('✅ Base de dados re-alimentada com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

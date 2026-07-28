import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import apiRoutes from './routes/api.js';
import { prisma } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Plural Locações Backend API', timestamp: new Date() });
});

app.use('/api', apiRoutes);

async function ensureTaxonomySeed() {
  try {
    const devUser = await prisma.user.findUnique({
      where: { email: 'helpus.ecommerce@gmail.com' }
    });

    if (!devUser) {
      console.log('🌱 Criando conta SuperAdmin Desenvolvedor (helpus.ecommerce@gmail.com)...');
      const hashDevPassword = await bcrypt.hash('@dmLocal1993', 10);
      await prisma.user.create({
        data: {
          name: 'Wagner (Desenvolvedor Geral)',
          email: 'helpus.ecommerce@gmail.com',
          password: hashDevPassword,
          phone: '(83) 99908-7188',
          roleCode: 'DEVELOPER'
        }
      });
    }

    // Departamentos
    const depMobiliario = await prisma.department.upsert({
      where: { slug: 'mobiliario-lounges' },
      update: {},
      create: { name: 'Mobiliário & Lounges', slug: 'mobiliario-lounges' }
    });

    const depEstruturas = await prisma.department.upsert({
      where: { slug: 'estruturas-climatizacao' },
      update: {},
      create: { name: 'Estruturas & Climatização', slug: 'estruturas-climatizacao' }
    });

    const depKits = await prisma.department.upsert({
      where: { slug: 'kits-ambientes' },
      update: {},
      create: { name: 'Kits & Sugestões de Ambientes', slug: 'kits-ambientes' }
    });

    // Categorias
    const catAssentos = await prisma.category.upsert({
      where: { slug: 'assentos-cadeiras' },
      update: { name: 'Assentos & Cadeiras', departmentId: depMobiliario.id },
      create: { name: 'Assentos & Cadeiras', slug: 'assentos-cadeiras', departmentId: depMobiliario.id }
    });

    const catMesas = await prisma.category.upsert({
      where: { slug: 'mesas-bancadas' },
      update: { name: 'Mesas & Bancadas', departmentId: depMobiliario.id },
      create: { name: 'Mesas & Bancadas', slug: 'mesas-bancadas', departmentId: depMobiliario.id }
    });

    const catTendas = await prisma.category.upsert({
      where: { slug: 'tendas-coberturas' },
      update: { name: 'Tendas & Coberturas', departmentId: depEstruturas.id },
      create: { name: 'Tendas & Coberturas', slug: 'tendas-coberturas', departmentId: depEstruturas.id }
    });

    const catClima = await prisma.category.upsert({
      where: { slug: 'climatizacao-iluminacao' },
      update: { name: 'Climatização & Iluminação', departmentId: depEstruturas.id },
      create: { name: 'Climatização & Iluminação', slug: 'climatizacao-iluminacao', departmentId: depEstruturas.id }
    });

    const catCombos = await prisma.category.upsert({
      where: { slug: 'combos-kits-prontos' },
      update: { name: 'Combos & Kits Prontos', departmentId: depKits.id },
      create: { name: 'Combos & Kits Prontos', slug: 'combos-kits-prontos', departmentId: depKits.id }
    });

    const mockProducts = [
      {
        sku: 'CAD-TIF-01',
        name: 'Cadeira Tiffany Dourada Polipropileno',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 14.50,
        priceWeekly: 65.00,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=800&q=80',
        description: 'Cadeira Tiffany monobloco injetada em polipropileno de alta resistência. Design clássico ideal para casamentos e banquetes.',
        color: 'Dourado Metálico',
        material: 'Polipropileno Virgem',
        dimensions: '40cm x 88cm x 42cm',
        maxWeight: 'INMETRO 180 kg',
        highlight: '👑 Líder de Locações para Casamentos'
      },
      {
        sku: 'CAD-TIF-02',
        name: 'Cadeira Tiffany Branca Clean',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 12.00,
        priceWeekly: 55.00,
        stock: 250,
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80',
        description: 'Cadeira Tiffany na cor branca puríssima. Perfeita para batizados, formaturas e eventos corporativos de alto padrão.',
        color: 'Branca Puríssima',
        material: 'Polipropileno Alta Densidade',
        dimensions: '40cm x 88cm x 42cm',
        maxWeight: '180 kg',
        highlight: '✨ Acabamento Sem Encaixes'
      },
      {
        sku: 'CAD-PAR-03',
        name: 'Cadeira Paris Amadeirada Rústica',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 16.00,
        priceWeekly: 75.00,
        stock: 120,
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
        description: 'Cadeira modelo Paris em acabamento amadeirado. Traz elegância rústica para casamentos na praia e eventos ao ar livre.',
        color: 'Madeira Imbuia',
        material: 'Resina Amadeirada com Fibra',
        dimensions: '42cm x 90cm x 45cm',
        maxWeight: '160 kg',
        highlight: '🌿 Estilo Boho & Beach Wedding'
      },
      {
        sku: 'CAD-BIS-04',
        name: 'Cadeira Bistrô Plástica Branca Reforçada',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 3.50,
        priceWeekly: 15.00,
        stock: 500,
        image: '/mesas-e-cadeiras-01.jpeg',
        description: 'Cadeira bistrô tradicional com selo INMETRO de qualidade. Confortável, lavável e empilhável.',
        color: 'Branca Clean',
        material: 'Polipropileno 100% Reciclável',
        dimensions: '52cm x 84cm x 54cm',
        maxWeight: 'INMETRO 182 kg',
        highlight: '🛡️ Certificação de Segurança INMETRO'
      },
      {
        sku: 'CAD-BIS-05',
        name: 'Cadeira Bistrô Plástica Preta Nobre',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 3.50,
        priceWeekly: 15.00,
        stock: 300,
        image: '/mesas-e-cadeiras-02.jpeg',
        description: 'Cadeira bistrô preta monobloco. Ideal para feiras comerciais, congressos e eventos noturnos.',
        color: 'Preta Fosca',
        material: 'Polipropileno Virgem',
        dimensions: '52cm x 84cm x 54cm',
        maxWeight: '182 kg',
        highlight: '🖤 Design Moderno & Versátil'
      },
      {
        sku: 'CAD-DIO-06',
        name: 'Cadeira Dior Policarbonato Transparente',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 19.90,
        priceWeekly: 90.00,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
        description: 'Cadeira Dior transparente em policarbonato injetado. Efeito de cristal e elegância insuperável para banquetes de luxo.',
        color: 'Transparente Efeito Cristal',
        material: 'Policarbonato Bayer UV',
        dimensions: '41cm x 92cm x 43cm',
        maxWeight: '150 kg',
        highlight: '💎 Luxo Absoluto para Recepções'
      },
      {
        sku: 'CAD-TOL-07',
        name: 'Cadeira Iron Tolix Industrial Preta',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 11.00,
        priceWeekly: 48.00,
        stock: 150,
        image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80',
        description: 'Cadeira modelo Tolix em aço pintado com pintura eletrostática preta. Perfeita para eventos estilo industrial e feiras gastronômicas.',
        color: 'Preto Semi-Brilho',
        material: 'Aço Carbono Estampado',
        dimensions: '44cm x 85cm x 45cm',
        maxWeight: '160 kg',
        highlight: '🏭 Estilo Industrial & Urban'
      },
      {
        sku: 'BAN-BIS-08',
        name: 'Banqueta Alta Bistrô Tolix com Encosto',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 15.00,
        priceWeekly: 65.00,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        description: 'Banqueta alta para mesas bistrô e balcões de bar. Assento de 76cm com apoio para os pés e encosto ergonômico.',
        color: 'Preto Fosco',
        material: 'Aço Carbono com Epóxi',
        dimensions: '43cm x 94cm x 43cm (Assento 76cm)',
        maxWeight: '140 kg',
        highlight: '🍸 Ideal para Bares & Coquetéis'
      },
      {
        sku: 'POL-LOU-09',
        name: 'Poltrona Lounge Velvet Aveludada Esmeralda',
        categoryId: catAssentos.id,
        departmentId: depMobiliario.id,
        priceDaily: 65.00,
        priceWeekly: 280.00,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
        description: 'Poltrona individual estofada em veludo verde esmeralda com pés palito dourados. Destaque garantido em lounges VIP.',
        color: 'Verde Esmeralda',
        material: 'Veludo Premium & Madeira Nobre',
        dimensions: '75cm x 82cm x 70cm',
        maxWeight: '150 kg',
        highlight: '🛋️ Espaço VIP & Salão de Fotos'
      },
      {
        sku: 'MES-RED-11',
        name: 'Mesa Redonda Monobloco Plástica 90cm',
        categoryId: catMesas.id,
        departmentId: depMobiliario.id,
        priceDaily: 8.00,
        priceWeekly: 35.00,
        stock: 100,
        image: '/mesas-e-cadeiras-01.jpeg',
        description: 'Mesa redonda plástica com furo central para ombrelone. Acomoda confortavelmente 4 pessoas.',
        color: 'Branca',
        material: 'Polipropileno com Proteção UV',
        dimensions: '90cm diâmetro x 72cm altura',
        maxWeight: '50 kg distribuídos',
        highlight: '☀️ Suporte a Ombrelone'
      },
      {
        sku: 'MES-RED-12',
        name: 'Mesa Redonda Dobrável 8 Lugares 1,50m',
        categoryId: catMesas.id,
        departmentId: depMobiliario.id,
        priceDaily: 25.00,
        priceWeekly: 100.00,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80',
        description: 'Mesa redonda dobrável tampo em PEAD e pés de aço. Acomoda até 8 convidados para jantares e recepções.',
        color: 'Branco Granitado',
        material: 'Polietileno de Alta Densidade (PEAD) & Aço',
        dimensions: '152cm diâmetro x 74cm altura',
        maxWeight: '150 kg',
        highlight: '👥 Acomoda 8 Convidados'
      },
      {
        sku: 'MES-RED-13',
        name: 'Mesa Redonda Dobrável 10 Lugares 1,80m',
        categoryId: catMesas.id,
        departmentId: depMobiliario.id,
        priceDaily: 35.00,
        priceWeekly: 140.00,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80',
        description: 'Mesa redonda gigante de 1,80m de diâmetro. Ideal para banquetes corporativos e casamentos de grande porte.',
        color: 'Branco Granitado',
        material: 'PEAD Virgem & Pés de Aço Tubular',
        dimensions: '183cm diâmetro x 74cm altura',
        maxWeight: '200 kg',
        highlight: '🍽️ Acomoda 10 Convidados'
      },
      {
        sku: 'MES-PRAN-14',
        name: 'Mesa Pranchão Retangular 2,00m x 0,90m',
        categoryId: catMesas.id,
        departmentId: depMobiliario.id,
        priceDaily: 28.00,
        priceWeekly: 110.00,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&q=80',
        description: 'Mesa pranchão retangular dobrável. Excelente para composição de mesas familiares longas, apoio de buffet e credenciamento.',
        color: 'Branco Granitado',
        material: 'PEAD Tampo Inteiriço & Pés de Aço',
        dimensions: '200cm x 90cm x 74cm',
        maxWeight: '180 kg',
        highlight: '🍲 Perfeita para Ilhas de Buffet'
      },
      {
        sku: 'MES-BIS-15',
        name: 'Mesa Bistrô Alta de Vidro com Base Cromada',
        categoryId: catMesas.id,
        departmentId: depMobiliario.id,
        priceDaily: 30.00,
        priceWeekly: 120.00,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
        description: 'Mesa bistrô de apoio em pé com tampo de vidro temperado de 60cm e coluna cromada. Essencial para coquetéis e recepções.',
        color: 'Vidro Transparente & Inox',
        material: 'Vidro Temperado 8mm & Aço Cromado',
        dimensions: '60cm diâmetro x 105cm altura',
        maxWeight: '40 kg',
        highlight: '🍸 Ideal para Coquetel em Pé'
      },
      {
        sku: 'TEN-PIR-19',
        name: 'Tenda Piramidal 5x5m Branca Reforçada',
        categoryId: catTendas.id,
        departmentId: depEstruturas.id,
        priceDaily: 180.00,
        priceWeekly: 720.00,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1510076857177-7470076d4298?w=800&q=80',
        description: 'Tenda piramidal 5m x 5m (25m²) em lona blackout com tratamento anti-chamas e pés de aço galvanizado.',
        color: 'Branca Lona Blackout',
        material: 'Lona PVC TD1000 & Aço Galvanizado',
        dimensions: '5,00m x 5,00m (Pé direito 3,00m)',
        maxWeight: 'Proteção contra ventos até 60 km/h',
        highlight: '☂️ Lona 100% Impermeável & Térmica'
      },
      {
        sku: 'TEN-PIR-20',
        name: 'Tenda Piramidal 10x10m Branca Gigante',
        categoryId: catTendas.id,
        departmentId: depEstruturas.id,
        priceDaily: 450.00,
        priceWeekly: 1800.00,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
        description: 'Tenda gigante 10m x 10m (100m²). Cobre até 120 pessoas sentadas. Inclui calhas de escoamento e montagem especializada.',
        color: 'Branca Lona Blackout',
        material: 'Lona PVC Reforçada & Estrutura Treliçada',
        dimensions: '10,00m x 10,00m (Pé direito 4,00m)',
        maxWeight: 'Capacidade até 120 convidados',
        highlight: '🎪 Cobertura Total para Grandiosos Eventos'
      },
      {
        sku: 'TEN-CRI-21',
        name: 'Tenda Cristal Transparente Panorâmica 10x10m',
        categoryId: catTendas.id,
        departmentId: depEstruturas.id,
        priceDaily: 650.00,
        priceWeekly: 2600.00,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
        description: 'Tenda com lona cristal transparente que permite visualização do céu estrelado ou da paisagem. Visual deslumbrante à noite.',
        color: 'Transparente Cristal UV',
        material: 'Lona PVC Cristal 0,60mm & Aço Galvanizado',
        dimensions: '10,00m x 10,00m',
        maxWeight: 'Efeito Panorâmico Noturno',
        highlight: '🌌 Visão Céu Estrelado para Casamentos Noturnos'
      },
      {
        sku: 'PIS-DAN-22',
        name: 'Pista de Dança Parisiense Quadriculada 5x5m',
        categoryId: catTendas.id,
        departmentId: depEstruturas.id,
        priceDaily: 380.00,
        priceWeekly: 1500.00,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        description: 'Pista de dança em placas fenólicas revestidas com vinil adesivo quadriculado preto e branco. Inclui rampa de acabamento.',
        color: 'Preto & Branco Chess',
        material: 'Compensado Naval 18mm & Revestimento Vinílico',
        dimensions: '5,00m x 5,00m (25m²)',
        maxWeight: 'Carga de impacto 500 kg/m²',
        highlight: '🕺 O Centro da Festa de Casamento ou 15 Anos'
      },
      {
        sku: 'CLI-EVA-24',
        name: 'Climatizador Evaporativo Industrial 45 Litros',
        categoryId: catClima.id,
        departmentId: depEstruturas.id,
        priceDaily: 110.00,
        priceWeekly: 440.00,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
        description: 'Climatizador portátil de alto fluxo de ar (5000 m³/h). Reduz a temperatura em até 8°C e renova o ar em tendas e galpões.',
        color: 'Cinza / Branco',
        material: 'Polímero de Alta Resistência (220V)',
        dimensions: '65cm x 115cm x 42cm',
        maxWeight: 'Tanque de 45 L (Autonomia 8h)',
        highlight: '❄️ Redução de até 8°C no Calor de João Pessoa'
      },
      {
        sku: 'REF-LED-25',
        name: 'Refletor PAR LED RGBW 54x3W com DMX',
        categoryId: catClima.id,
        departmentId: depEstruturas.id,
        priceDaily: 25.00,
        priceWeekly: 100.00,
        stock: 120,
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
        description: 'Refletor de iluminação cênica para valorização de fachadas, árvores, pilares e arranjos florais. Troca de cores automática ou por mesa DMX.',
        color: 'Preto (Luz RGBW 16 milhões de cores)',
        material: 'Alumínio Injetado (Bivolt)',
        dimensions: '22cm x 22cm x 15cm',
        maxWeight: 'Baixo Consumo LED',
        highlight: '💡 Iluminação Decorativa de Ambientes'
      },
      {
        sku: 'KIT-PRA-28',
        name: 'Kit Coquetel Beira Mar (10 Bistrôs + 40 Banquetas)',
        categoryId: catCombos.id,
        departmentId: depKits.id,
        isKit: true,
        priceDaily: 650.00,
        priceWeekly: 2600.00,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
        description: 'Combo perfeito para coquetel de aniversário ou recepção corporativa. Inclui 10 Mesas Bistrô Altas e 40 Banquetas Tolix.',
        color: 'Preto & Inox',
        material: 'Aço & Vidro Temperado',
        dimensions: 'Capacidade para 40 a 60 convidados',
        maxWeight: 'Economia de 20% no pacote',
        highlight: '🔥 Mais Vendido para Aniversários & Happy Hour'
      },
      {
        sku: 'KIT-CAS-29',
        name: 'Kit Cerimônia Casamento 100 Lugares (Tiffany + Altar)',
        categoryId: catCombos.id,
        departmentId: depKits.id,
        isKit: true,
        priceDaily: 1690.00,
        priceWeekly: 6500.00,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        description: 'Solução completa para a cerimônia de casamento. Inclui 100 Cadeiras Tiffany Douradas, 1 Gazebo de Madeira para o Altar e Passarela.',
        color: 'Dourado & Madeira',
        material: 'Móveis Nobres Selecionados',
        dimensions: 'Atende 100 convidados sentados',
        maxWeight: 'Montagem e Frete Inclusos',
        highlight: '💍 Pacote Completo para Cerimônia de Casamento'
      }
    ];

    for (const p of mockProducts) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: p,
        create: p
      });
    }

    console.log('✅ Taxonomia e produtos atualizados no startup do servidor.');
  } catch (err) {
    console.error('Erro ao verificar taxonomia no startup:', err);
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Servidor Plural Locações rodando na porta ${PORT}`);
  await ensureTaxonomySeed();
});

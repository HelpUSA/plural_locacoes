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

// Rota de Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Plural Locações Backend API', timestamp: new Date() });
});

// Rotas da API
app.use('/api', apiRoutes);

// Inicializador de Segurança: Garante o cadastro da conta SuperAdmin Desenvolvedor no startup
async function ensureSeed() {
  try {
    const devUser = await prisma.user.findUnique({
      where: { email: 'helpus.ecommerce@gmail.com' }
    });

    if (!devUser) {
      console.log('🌱 Inicializando conta de SuperAdmin Desenvolvedor (helpus.ecommerce@gmail.com)...');
      const hashDevPassword = await bcrypt.hash('@dmLocal1993', 10);
      const hashOwnerPassword = await bcrypt.hash('gerente123', 10);
      const hashOperatorPassword = await bcrypt.hash('operador123', 10);

      await prisma.user.createMany({
        data: [
          {
            name: 'Wagner (Desenvolvedor Geral)',
            email: 'helpus.ecommerce@gmail.com',
            password: hashDevPassword,
            phone: '(83) 99908-7188',
            roleCode: 'DEVELOPER'
          },
          {
            name: 'Júlio (Gerente Plural)',
            email: 'gerente@plurallocacoes.com.br',
            password: hashOwnerPassword,
            phone: '(83) 99908-7188',
            roleCode: 'STORE_OWNER'
          },
          {
            name: 'Carlos (Operador Logístico)',
            email: 'operador@plurallocacoes.com.br',
            password: hashOperatorPassword,
            phone: '(83) 98888-1111',
            roleCode: 'OPERATOR'
          }
        ],
        skipDuplicates: true
      });
      console.log('✅ Usuários corporativos criados no banco.');
    }
  } catch (err) {
    console.error('Erro ao verificar seed de desenvolvimento no startup:', err);
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Servidor Plural Locações rodando na porta ${PORT}`);
  await ensureSeed();
});

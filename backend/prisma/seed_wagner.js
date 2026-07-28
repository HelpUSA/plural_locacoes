import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Garantindo conta DEVELOPER para wagner.redes@gmail.com...');

  const hashPassword = await bcrypt.hash('@dmLocal1993', 10);

  const user = await prisma.user.upsert({
    where: { email: 'wagner.redes@gmail.com' },
    update: {
      roleCode: 'DEVELOPER'
    },
    create: {
      name: 'Wagner (Desenvolvedor Geral)',
      email: 'wagner.redes@gmail.com',
      password: hashPassword,
      phone: '(83) 99908-7188',
      roleCode: 'DEVELOPER'
    }
  });

  console.log('✅ Usuário wagner.redes@gmail.com configurado como DEVELOPER:', user);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao semear usuário:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, AppRole, CompanyType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  // ── Usuário admin ──────────────────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where:  { email: 'admin@granity.com' },
    update: {},
    create: { email: 'admin@granity.com', passwordHash },
  });

  // ── Empresa ────────────────────────────────────────────────────────────────
  const company = await prisma.company.upsert({
    where:  { cnpj: '12.345.678/0001-99' },
    update: {},
    create: {
      name:    'Pedreira Serra Verde',
      cnpj:    '12.345.678/0001-99',
      address: 'Estrada da Pedreira, km 12 — Cachoeiro de Itapemirim, ES',
      type:    CompanyType.PEDREIRA,
    },
  });

  // ── Employee (vincula usuário à empresa) ───────────────────────────────────
  await prisma.employee.upsert({
    where:  { companyId_userId: { companyId: company.id, userId: user.id } },
    update: {},
    create: {
      companyId: company.id,
      userId:    user.id,
      name:      'Caique Silva',
      jobTitle:  'Gestor',
      appRole:   AppRole.GESTOR,
    },
  });

  console.log(`Seed OK — usuário: ${user.email} | empresa: ${company.name}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

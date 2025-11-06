import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function cleanDatabase() {
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();
}

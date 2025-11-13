import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const permissionsKeys = [
    'users:read',
    'users:manage',
    'users:invite',
    'classes:read',
    'classes:manage',
  ];

  await prisma.permission.createMany({
    data: permissionsKeys.map((key) => ({ key: key })),
    skipDuplicates: true,
  });

  const student = await prisma.role.upsert({
    where: { name: 'student' },
    update: {},
    create: { name: 'student', system: true },
  });
  const manager = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager', system: true },
  });
  const admin = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', system: true },
  });

  const permissions = await prisma.permission.findMany();
  const byKey = new Map(
    permissions.map((permission) => [permission.key, permission]),
  );

  const studentKeys = ['users:read'];
  const managerKeys = ['users:read', 'classes:read'];
  const adminKeys = [
    'users:read',
    'users:manage',
    'users:invite',
    'classes:read',
    'classes:manage',
  ];

  await prisma.rolePermission.createMany({
    data: studentKeys.map((key) => ({
      roleId: student.id,
      permissionId: byKey.get(key)!.id,
    })),
    skipDuplicates: true,
  });
  await prisma.rolePermission.createMany({
    data: managerKeys.map((key) => ({
      roleId: manager.id,
      permissionId: byKey.get(key)!.id,
    })),
    skipDuplicates: true,
  });
  await prisma.rolePermission.createMany({
    data: adminKeys.map((key) => ({
      roleId: admin.id,
      permissionId: byKey.get(key)!.id,
    })),
    skipDuplicates: true,
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});

import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, DEFAULT_ROLES } from '../src/auth/permissions.constants';

const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: PERMISSIONS.map((permission) => ({ key: permission })),
    skipDuplicates: true,
  });

  const roles = await Promise.all(
    Object.keys(DEFAULT_ROLES).map((roleName) =>
      prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName, system: true },
      }),
    ),
  );
  const rolesByName = new Map(roles.map((role) => [role.name, role]));

  const permissions = await prisma.permission.findMany();
  const permissionsByKey = new Map(
    permissions.map((permission) => [permission.key, permission]),
  );

  for (const [roleName, permissionKeys] of Object.entries(DEFAULT_ROLES)) {
    await prisma.rolePermission.createMany({
      data: permissionKeys.map((key) => ({
        roleId: rolesByName.get(roleName)!.id,
        permissionId: permissionsByKey.get(key)!.id,
      })),
      skipDuplicates: true,
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

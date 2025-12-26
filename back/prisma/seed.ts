import { PrismaClient } from '@prisma/client';
import { PERMISSIONS, DEFAULT_ROLES } from '../src/auth/permissions.constants';
import * as argon2 from 'argon2';

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
  const institution = await prisma.institution.findFirst({
    where: { name: 'ESGI' },
  });

  const institutionId =
    institution?.id ??
    (
      await prisma.institution.create({
        data: { name: 'ESGI' },
      })
    ).id;

  const password = await argon2.hash('password123');

  for (const roleName of Object.keys(DEFAULT_ROLES)) {
    const email = `${roleName}@izizzi.fr`;
    
    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password, // Update password if user exists to ensure it matches
      },
      create: {
        email,
        password,
        firstName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
        lastName: 'User',
        institutionId,
      },
    });

    const role = rolesByName.get(roleName);
    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

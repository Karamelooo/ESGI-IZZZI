import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async getPermissionsForUser(userId: number): Promise<string[]> {
    if (!userId) {
      return [];
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        key: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const permissions = user.userRoles
      .flatMap((userRole) => userRole.role.rolePermissions)
      .map((rolePermission) => rolePermission.permission.key);

    return Array.from(new Set(permissions));
  }

  async checkPermissions(
    userId: number,
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = await this.getPermissionsForUser(userId);

    return requiredPermissions.every((required) => {
      if (userPermissions.includes(required)) {
        return true;
      }

      const [resource] = required.split(':');
      if (resource) {
        const managePermission = `${resource}:manage`;
        if (userPermissions.includes(managePermission)) {
          return true;
        }
      }

      return false;
    });
  }
}

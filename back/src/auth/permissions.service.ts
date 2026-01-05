import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves a list of permission keys for a given user.
   * This method can be enhanced with caching strategies (e.g., Redis) in the future.
   */
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

    // Flatten permissions from all roles
    const permissions = user.userRoles
      .flatMap((userRole) => userRole.role.rolePermissions)
      .map((rolePermission) => rolePermission.permission.key);

    // Remove duplicates
    return Array.from(new Set(permissions));
  }

  /**
   * Checks if a user possesses all the required permissions.
   */
  async checkPermissions(
    userId: number,
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = await this.getPermissionsForUser(userId);

    return requiredPermissions.every((required) =>
      userPermissions.includes(required),
    );
  }
}

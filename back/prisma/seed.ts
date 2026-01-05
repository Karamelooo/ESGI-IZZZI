import { PrismaClient } from '@prisma/client';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  try {
    const yamlPath = path.join(__dirname, 'initialData.yaml');
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data: any = yaml.load(fileContents);

    const permissionMap = new Map<string, number>();
    for (const key of data.permissions) {
      const permission = await prisma.permission.upsert({
        where: { key: key },
        update: {},
        create: { key: key },
      });
      permissionMap.set(key, permission.id);
    }

    for (const roleData of data.roles) {
      await prisma.role.upsert({
        where: { name: roleData.name },
        update: {
          description: roleData.description,
          system: roleData.system,
          rolePermissions: {
            deleteMany: {},
            create: roleData.permissions.map((permKey: string) => ({
              permission: { connect: { key: permKey } },
            })),
          },
        },
        create: {
          name: roleData.name,
          description: roleData.description,
          system: roleData.system,
          rolePermissions: {
            create: roleData.permissions.map((permKey: string) => ({
              permission: { connect: { key: permKey } },
            })),
          },
        },
      });
    }

    const templateIdMap = new Map<string, number>();
    let templateCounter = 1;

    for (const templateData of data.formTemplates) {
      const existing = await prisma.formTemplate.findFirst({
        where: { name: templateData.name },
      });

      let templateId: number;

      if (existing) {
        templateId = existing.id;
        await prisma.formTemplate.update({
          where: { id: existing.id },
          data: {
            description: templateData.description,
            questionGroups: { deleteMany: {} },
            questions: { deleteMany: {} },
          },
        });
      } else {
        const created = await prisma.formTemplate.create({
          data: {
            name: templateData.name,
            description: templateData.description,
          },
        });
        templateId = created.id;
      }

      if (templateData.groups) {
        const groupMap = new Map<string, number>();
        for (const group of templateData.groups) {
          const createdGroup = await prisma.templateQuestionGroup.create({
            data: {
              name: group.name,
              description: group.description,
              order: group.order,
              templateId: templateId,
            },
          });
          groupMap.set(group.name, createdGroup.id);

          if (group.questions) {
            for (const q of group.questions) {
              await prisma.templateQuestion.create({
                data: {
                  label: q.label,
                  type: q.type,
                  order: q.order,
                  required: true,
                  options: q.options || [],
                  templateId: templateId,
                  groupId: createdGroup.id,
                },
              });
            }
          }
        }
      }
    }

    const basiqueTemplate = await prisma.formTemplate.findFirst({
      where: { name: 'Basique' },
    });
    const basiqueTemplateId = basiqueTemplate?.id;

    for (const instData of data.institutions) {
      let institution = await prisma.institution.findFirst({
        where: { name: instData.name },
      });

      if (!institution) {
        institution = await prisma.institution.create({
          data: { name: instData.name },
        });
      }

      if (instData.users) {
        for (const userData of instData.users) {
          const hashedPassword = await argon2.hash(userData.password);
          await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              password: hashedPassword,
              institutionId: institution.id,
              userRoles: {
                create: {
                  role: { connect: { name: userData.role } },
                },
              },
            },
          });
        }
      }

      if (instData.classes) {
        for (const classData of instData.classes) {
          const studentEmailsStr = Array.isArray(classData.studentEmails)
            ? classData.studentEmails.join(',')
            : '';

          let cls = await prisma.class.findFirst({
            where: {
              name: classData.name,
              institutionId: institution.id,
            },
          });

          if (!cls) {
            cls = await prisma.class.create({
              data: {
                name: classData.name,
                description: classData.description,
                studentCount: classData.studentCount,
                studentEmails: studentEmailsStr,
                institutionId: institution.id,
              },
            });
          } else {
            await prisma.class.update({
              where: { id: cls.id },
              data: {
                description: classData.description,
                studentCount: classData.studentCount,
                studentEmails: studentEmailsStr,
              },
            });
          }

          if (classData.subjects) {
            for (const subjectData of classData.subjects) {
              let subject = await prisma.subject.findFirst({
                where: {
                  name: subjectData.name,
                  classId: cls.id,
                },
              });

              const subjectPayload = {
                name: subjectData.name,
                instructorName: subjectData.instructorName,
                instructorEmail: subjectData.instructorEmail,
                startDate: subjectData.startDate
                  ? new Date(subjectData.startDate)
                  : null,
                endDate: subjectData.endDate
                  ? new Date(subjectData.endDate)
                  : null,
                institutionId: institution.id,
                classId: cls.id,
              };

              if (!subject) {
                subject = await prisma.subject.create({
                  data: subjectPayload,
                });
              } else {
                subject = await prisma.subject.update({
                  where: { id: subject.id },
                  data: subjectPayload,
                });
              }

              if (subjectData.forms) {
                for (const formData of subjectData.forms) {
                  let effectiveTemplateId = formData.templateId;
                  if (formData.templateId === 1 && basiqueTemplateId) {
                    effectiveTemplateId = basiqueTemplateId;
                  }

                  await prisma.form.upsert({
                    where: {
                      subjectId_type: {
                        subjectId: subject.id,
                        type: formData.type,
                      },
                    },
                    update: {
                      status: formData.status,
                      templateId: effectiveTemplateId,
                    },
                    create: {
                      type: formData.type,
                      status: formData.status,
                      subjectId: subject.id,
                      templateId: effectiveTemplateId,
                    },
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

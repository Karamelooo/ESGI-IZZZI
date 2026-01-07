import { PrismaClient } from '@prisma/client';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const RESPONSES_PER_FORM = 50;
const DAYS_DISTRIBUTION = 5;

const shortTextResponses = [
  "Les bases de l'architecture logicielle",
  'La gestion des APIs REST',
  'Les bonnes pratiques de code',
  "L'intégration continue",
  'Le déploiement automatisé',
  "Les tests unitaires et d'intégration",
  'La modélisation des données',
  'La sécurité applicative',
  "L'optimisation des performances",
  'La documentation technique',
  'Les patterns de conception',
  'La gestion des erreurs',
  "L'authentification et autorisation",
  'Les architectures distribuées',
  "Le versioning d'API",
];

const longTextPositiveResponses = [
  "L'intervenant explique très clairement les concepts techniques. Sa pédagogie est excellente et il prend le temps de répondre à toutes les questions.",
  "Très bon cours, l'intervenant est passionné par son sujet et cela se ressent. Les exemples pratiques sont particulièrement utiles.",
  "Excellente maîtrise du sujet. L'intervenant sait vulgariser les concepts complexes et les rendre accessibles à tous.",
  "Pédagogie excellente, cours très interactif et captivant. J'ai beaucoup appris et je recommande vivement ce cours.",
  "L'intervenant est à l'écoute des étudiants et adapte son cours en fonction de nos besoins. Très professionnel.",
  'Les travaux pratiques sont très bien conçus et permettent de mettre en application les concepts théoriques.',
  "Cours structuré et progressif. L'intervenant fait preuve d'une grande patience et d'une vraie volonté de transmettre.",
  "Très bonne expérience professionnelle de l'intervenant qui enrichit le cours avec des cas réels.",
];

const longTextMixedResponses = [
  "Bonne maîtrise du sujet mais manque d'exercices pratiques. Plus de TP seraient appréciés.",
  'Cours intéressant mais le rythme est parfois trop rapide. Il serait bien de prendre plus de temps sur certains concepts.',
  'Contenu de qualité mais les supports pourraient être améliorés. Quelques schémas supplémentaires aideraient à la compréhension.',
  "L'intervenant connaît bien son sujet mais pourrait être plus dynamique dans sa présentation.",
  "Cours correct dans l'ensemble. Quelques points mériteraient d'être approfondis.",
  'Le cours répond aux attentes de base mais pourrait aller plus loin sur certains aspects avancés.',
];

const longTextNegativeResponses = [
  "Le cours manque de structure. Il serait utile d'avoir un plan plus clair dès le début.",
  'Rythme trop rapide, difficile de suivre parfois. Plus de pauses et de récapitulatifs seraient bienvenus.',
  'Les exemples pourraient être plus variés et plus proches de nos projets.',
];

const globalComments = [
  'Très satisfait de ce cours, je le recommande à tous les étudiants intéressés par le sujet.',
  "Cours enrichissant qui m'a permis de développer de nouvelles compétences.",
  "Bonne formation dans l'ensemble, quelques ajustements mineurs à faire.",
  "Je suis content d'avoir suivi ce cours. Les connaissances acquises me seront utiles.",
  'Formation de qualité avec un bon équilibre entre théorie et pratique.',
  'Cours intéressant mais perfectible sur certains aspects.',
  'Globalement satisfait, le cours a répondu à mes attentes.',
  "Expérience positive, j'ai appris beaucoup de choses nouvelles.",
  'Le cours mériterait plus de temps pour approfondir certains sujets.',
  "Bonne introduction au sujet, mais j'aurais aimé aller plus loin.",
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSubset<T>(arr: T[], minCount = 1, maxCount = 3): T[] {
  const count = Math.min(
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount,
    arr.length,
  );
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function weightedRandomChoice<T>(options: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < options.length; i++) {
    random -= weights[i];
    if (random <= 0) return options[i];
  }
  return options[options.length - 1];
}

function generateTimestamp(daysAgo: number, baseDate: Date): Date {
  const timestamp = new Date(baseDate);
  timestamp.setDate(baseDate.getDate() - daysAgo);
  timestamp.setHours(Math.floor(Math.random() * 12) + 8);
  timestamp.setMinutes(Math.floor(Math.random() * 60));
  timestamp.setSeconds(Math.floor(Math.random() * 60));
  return timestamp;
}

function generateAnswerValue(
  questionType: string,
  options: string[] | null,
): any {
  switch (questionType) {
    case 'SINGLE_CHOICE':
      if (!options || options.length === 0) return null;
      const weights = options.map((_, i) => {
        if (options.length === 2) {
          return i === 0 ? 0.75 : 0.25;
        }
        if (options.length === 3) {
          return [0.25, 0.5, 0.25][i];
        }
        return 1;
      });
      return weightedRandomChoice(options, weights);

    case 'MULTIPLE_CHOICE':
      if (!options || options.length === 0) return [];
      return randomSubset(options, 1, Math.min(3, options.length));

    case 'SHORT_TEXT':
      return randomChoice(shortTextResponses);

    case 'LONG_TEXT':
      const responseType = Math.random();
      if (responseType < 0.7) {
        return randomChoice(longTextPositiveResponses);
      } else if (responseType < 0.9) {
        return randomChoice(longTextMixedResponses);
      } else {
        return randomChoice(longTextNegativeResponses);
      }

    case 'STAR_RATING':
      return weightedRandomChoice([1, 2, 3, 4, 5], [0.05, 0.1, 0.2, 0.35, 0.3]);

    default:
      return null;
  }
}

function generateGlobalRating(): number {
  return weightedRandomChoice([1, 2, 3, 4, 5], [0.05, 0.1, 0.2, 0.35, 0.3]);
}

async function generateResponsesForForm(
  formId: number,
  questions: Array<{ id: number; type: string; options: any }>,
  baseDate: Date,
) {
  const responses: Array<{
    studentEmail: string;
    globalRating: number;
    formId: number;
    createdAt: Date;
  }> = [];

  let responseIndex = 0;
  for (let day = 0; day < DAYS_DISTRIBUTION; day++) {
    const responsesForDay =
      day === DAYS_DISTRIBUTION - 1
        ? RESPONSES_PER_FORM - responseIndex
        : Math.floor(RESPONSES_PER_FORM / DAYS_DISTRIBUTION) +
          Math.floor(Math.random() * 3);

    for (
      let i = 0;
      i < responsesForDay && responseIndex < RESPONSES_PER_FORM;
      i++
    ) {
      const timestamp = generateTimestamp(day, baseDate);
      responses.push({
        studentEmail: `student${responseIndex + 1}@esgi.fr`,
        globalRating: generateGlobalRating(),
        formId: formId,
        createdAt: timestamp,
      });
      responseIndex++;
    }
  }

  for (const responseData of responses) {
    const response = await prisma.response.create({
      data: responseData,
    });

    const answersData = questions.map((q) => ({
      value: { content: generateAnswerValue(q.type, q.options) },
      responseId: response.id,
      questionId: q.id,
    }));

    await prisma.answer.createMany({
      data: answersData,
    });
  }

  return responses.length;
}

async function main() {
  try {
    const yamlPath = path.join(__dirname, 'initialData.yaml');
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const data: any = yaml.load(fileContents);

    const baseDate = new Date();

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

    const createdForms: number[] = [];

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
            ? classData.studentEmails.join(';')
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

                  const form = await prisma.form.upsert({
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

                  createdForms.push(form.id);
                }
              }
            }
          }
        }
      }
    }

    console.log(`\nGenerating responses for ${createdForms.length} forms...`);

    for (const formId of createdForms) {
      const form = await prisma.form.findUnique({
        where: { id: formId },
        include: {
          template: {
            include: {
              questions: true,
            },
          },
          subject: true,
        },
      });

      if (!form) continue;

      const existingResponses = await prisma.response.findMany({
        where: { formId: formId },
        select: { id: true },
      });

      if (existingResponses.length > 0) {
        await prisma.answer.deleteMany({
          where: {
            responseId: { in: existingResponses.map((r) => r.id) },
          },
        });
        await prisma.response.deleteMany({
          where: { formId: formId },
        });
      }

      const questions = form.template.questions.map((q) => ({
        id: q.id,
        type: q.type,
        options: q.options as string[] | null,
      }));

      const count = await generateResponsesForForm(formId, questions, baseDate);
      console.log(
        `  - Generated ${count} responses for form "${form.subject.name}" (${form.type})`,
      );
    }

    console.log('\nSeeding completed successfully!');
    console.log(`  - Total forms: ${createdForms.length}`);
    console.log(
      `  - Total responses: ${createdForms.length * RESPONSES_PER_FORM}`,
    );
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

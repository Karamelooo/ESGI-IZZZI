import { PrismaClient, QuestionType } from '@prisma/client';
import { PERMISSIONS, DEFAULT_ROLES } from '../src/auth/permissions.constants';

const prisma = new PrismaClient();

interface SeedQuestion {
  label: string;
  type: QuestionType;
  order: number;
  options?: string[];
}

interface SeedGroup {
  name: string;
  description: string;
  order: number;
  questions: SeedQuestion[];
}

interface SeedTemplate {
  id: number;
  name: string;
  description: string;
  groups: SeedGroup[];
}

async function seedAuth(prisma: PrismaClient) {
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

async function createFormTemplate(
  prisma: PrismaClient,
  template: SeedTemplate,
) {
  await prisma.formTemplate.upsert({
    where: { id: template.id },
    update: {
      name: template.name,
      description: template.description,
    },
    create: {
      id: template.id,
      name: template.name,
      description: template.description,
    },
  });

  const groupCount = await prisma.templateQuestionGroup.count({
    where: { templateId: template.id },
  });

  if (groupCount === 0) {
    for (const group of template.groups) {
      await prisma.templateQuestionGroup.create({
        data: {
          name: group.name,
          description: group.description,
          order: group.order,
          templateId: template.id,
          questions: {
            create: group.questions.map((q) => ({
              label: q.label,
              type: q.type,
              order: q.order,
              options: q.options,
              templateId: template.id,
            })),
          },
        },
      });
    }
  }
}

async function main() {
  await seedAuth(prisma);

  const basiqueTemplate: SeedTemplate = {
    id: 1,
    name: 'Basique',
    description: 'Un formulaire adapté à tous les cours.',
    groups: [
      {
        name: 'Vous',
        description: "Informations sur l'étudiant répondant.",
        order: 1,
        questions: [
          {
            label: 'Quel est votre niveau dans la thématique du cours ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 1,
            options: ['Je découvre', 'Je connais', "J'y suis familier"],
          },
          {
            label: 'Avez-vous assisté régulièrement à ce cours ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 2,
            options: ['Oui', 'Non'],
          },
        ],
      },
      {
        name: 'Le cours',
        description: 'Contenu et organisation du cours.',
        order: 2,
        questions: [
          {
            label: 'Les objectifs du cours sont-ils clairs ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 1,
            options: ['Oui', 'Non'],
          },
          {
            label: 'La difficulté du cours est :',
            type: QuestionType.SINGLE_CHOICE,
            order: 2,
            options: ['Trop basique', 'Adaptée', 'Trop élevée'],
          },
          {
            label: 'Le cours répond-il à vos attentes ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 3,
            options: ['Oui', 'Non'],
          },
          {
            label: 'Quels thèmes du cours vous paraissent-ils utiles ?',
            type: QuestionType.SHORT_TEXT,
            order: 4,
          },
        ],
      },
      {
        name: 'Pédagogie et supports',
        description: 'Méthodes pédagogiques et supports de cours.',
        order: 3,
        questions: [
          {
            label: "Quelle méthode est utilisée par l'intervenant ?",
            type: QuestionType.MULTIPLE_CHOICE,
            order: 1,
            options: [
              'Cours magistral',
              'Travaux dirigés (TD)',
              'Travaux pratiques (TP)',
            ],
          },
          {
            label: 'Les supports pédagogiques sont-ils clairs et utiles ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 2,
            options: ['Oui', 'Non'],
          },
        ],
      },
      {
        name: 'Intervenant',
        description: 'Intervenant dispensant le cours.',
        order: 4,
        questions: [
          {
            label: "L'intervenant maîtrise-t-il le sujet enseigné ?",
            type: QuestionType.SINGLE_CHOICE,
            order: 1,
            options: ['Oui', 'Non'],
          },
          {
            label: 'Est-ce facile de poser des questions ?',
            type: QuestionType.SINGLE_CHOICE,
            order: 2,
            options: ['Oui', 'Non'],
          },
          {
            label: "Quels points forts retenez-vous de l'intervenant ?",
            type: QuestionType.LONG_TEXT,
            order: 3,
          },
        ],
      },
      {
        name: 'Charge de travail et évaluation',
        description: 'Travail demandé pour le cours.',
        order: 5,
        questions: [
          {
            label: 'La charge de travail demandée est :',
            type: QuestionType.SINGLE_CHOICE,
            order: 1,
            options: ['Faible', 'Adaptée', 'Élevée'],
          },
          {
            label: 'Comment avez-vous été évalués ?',
            type: QuestionType.MULTIPLE_CHOICE,
            order: 2,
            options: ['Examen écrit', 'Examen oral', 'Projet'],
          },
          {
            label:
              "Les modalités d'évaluation sont-elles cohérentes avec le cours ?",
            type: QuestionType.SINGLE_CHOICE,
            order: 3,
            options: ['Oui', 'Non'],
          },
        ],
      },
      {
        name: 'Appréciation globale',
        description: 'Dernière étape !',
        order: 6,
        questions: [
          {
            label: "Recommanderiez-vous ce cours à d'autres étudiants ?",
            type: QuestionType.SINGLE_CHOICE,
            order: 1,
            options: ['Oui', 'Non'],
          },
          {
            label: 'Commentaires et suggestions additionnelles',
            type: QuestionType.LONG_TEXT,
            order: 2,
          },
        ],
      },
    ],
  };

  await createFormTemplate(prisma, basiqueTemplate);

  console.log('Seeding completed.');
}

main().finally(async () => {
  await prisma.$disconnect();
});

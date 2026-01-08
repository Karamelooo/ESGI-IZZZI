import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

// Target question groups for aggregation
const COURSE_CONTENT_GROUPS = ['Le cours'];
const INSTRUCTOR_PEDAGOGY_GROUPS = [
  'Pédagogie et supports',
  'Intervenant',
  'Charge de travail et évaluation',
];

interface TemporalData {
  labels: string[];
  avgRatings: number[];
  minRatings: number[];
  maxRatings: number[];
  submissionCounts: number[];
}

interface QuestionDistribution {
  questionId: number;
  questionLabel: string;
  options: string[];
  counts: number[];
}

interface GroupDistribution {
  groupName: string;
  questions: QuestionDistribution[];
}

export interface FormStatistics {
  metadata: {
    subjectName: string;
    className: string;
    institutionName: string;
  };
  temporal: TemporalData;
  ratingDistribution: {
    labels: string[];
    counts: number[];
  };
  courseContentDistributions: GroupDistribution[];
  instructorPedagogyDistributions: GroupDistribution[];
}

// Define the include object for type inference
const formWithRelationsInclude = {
  subject: {
    include: {
      class: {
        include: {
          institution: true,
        },
      },
    },
  },
  template: {
    include: {
      questions: {
        include: {
          group: true,
        },
        orderBy: { order: 'asc' as const },
      },
      questionGroups: {
        orderBy: { order: 'asc' as const },
      },
    },
  },
  responses: {
    include: {
      answers: {
        include: {
          question: {
            include: {
              group: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.FormInclude;

type FormWithRelations = Prisma.FormGetPayload<{
  include: typeof formWithRelationsInclude;
}>;

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFormStatistics(formId: number): Promise<FormStatistics> {
    // Fetch form with all related data
    const form = (await this.prisma.form.findUnique({
      where: { id: formId },
      include: formWithRelationsInclude,
    })) as FormWithRelations | null;

    if (!form) {
      throw new NotFoundException(`Form with id ${formId} not found`);
    }

    // Build metadata
    const metadata = {
      subjectName: form.subject.name,
      className: form.subject.class.name,
      institutionName: form.subject.class.institution.name,
    };

    // Calculate temporal data (last 5 days)
    const temporal = this.calculateTemporalData(form.responses);

    // Calculate rating distribution
    const ratingDistribution = this.calculateRatingDistribution(form.responses);

    // Calculate question distributions by group
    const courseContentDistributions = this.calculateGroupDistributions(
      form.template.questions,
      form.responses,
      COURSE_CONTENT_GROUPS,
    );

    const instructorPedagogyDistributions = this.calculateGroupDistributions(
      form.template.questions,
      form.responses,
      INSTRUCTOR_PEDAGOGY_GROUPS,
    );

    return {
      metadata,
      temporal,
      ratingDistribution,
      courseContentDistributions,
      instructorPedagogyDistributions,
    };
  }

  private calculateTemporalData(responses: any[]): TemporalData {
    const labels: string[] = [];
    const avgRatings: number[] = [];
    const minRatings: number[] = [];
    const maxRatings: number[] = [];
    const submissionCounts: number[] = [];

    // Get last 5 days
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // Format label
      const dayLabel = dayStart.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      labels.push(dayLabel);

      // Filter responses for this day
      const dayResponses = responses.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= dayStart && createdAt <= dayEnd;
      });

      submissionCounts.push(dayResponses.length);

      if (dayResponses.length > 0) {
        const ratings = dayResponses.map((r) => r.globalRating);
        avgRatings.push(
          Math.round(
            (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10,
          ) / 10,
        );
        minRatings.push(Math.min(...ratings));
        maxRatings.push(Math.max(...ratings));
      } else {
        avgRatings.push(0);
        minRatings.push(0);
        maxRatings.push(0);
      }
    }

    return { labels, avgRatings, minRatings, maxRatings, submissionCounts };
  }

  private calculateRatingDistribution(responses: any[]): {
    labels: string[];
    counts: number[];
  } {
    const labels = ['1', '2', '3', '4', '5'];
    const counts = [0, 0, 0, 0, 0];

    for (const response of responses) {
      const rating = response.globalRating;
      if (rating >= 1 && rating <= 5) {
        counts[rating - 1]++;
      }
    }

    return { labels, counts };
  }

  private calculateGroupDistributions(
    questions: any[],
    responses: any[],
    targetGroupNames: string[],
  ): GroupDistribution[] {
    const distributions: GroupDistribution[] = [];

    // Group questions by their group name
    const groupMap = new Map<string, any[]>();

    for (const question of questions) {
      if (!question.group) continue;
      const groupName = question.group.name;
      if (!targetGroupNames.includes(groupName)) continue;

      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(question);
    }

    // For each group, calculate distributions
    for (const groupName of targetGroupNames) {
      const groupQuestions = groupMap.get(groupName) || [];
      const questionDistributions: QuestionDistribution[] = [];

      for (const question of groupQuestions) {
        // Only process choice-based questions
        if (
          question.type !== 'SINGLE_CHOICE' &&
          question.type !== 'MULTIPLE_CHOICE'
        ) {
          continue;
        }

        const options: string[] = question.options || [];
        const counts = new Array(options.length).fill(0);

        // Count answers for this question
        for (const response of responses) {
          for (const answer of response.answers) {
            if (answer.questionId === question.id) {
              const value = answer.value?.content;
              if (Array.isArray(value)) {
                // Multiple choice
                for (const v of value) {
                  const idx = options.indexOf(v);
                  if (idx >= 0) counts[idx]++;
                }
              } else if (typeof value === 'string') {
                // Single choice
                const idx = options.indexOf(value);
                if (idx >= 0) counts[idx]++;
              }
            }
          }
        }

        questionDistributions.push({
          questionId: question.id,
          questionLabel: question.label,
          options,
          counts,
        });
      }

      if (questionDistributions.length > 0) {
        distributions.push({
          groupName,
          questions: questionDistributions,
        });
      }
    }

    return distributions;
  }
}

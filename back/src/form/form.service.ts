import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class FormService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  async create(createFormDto: CreateFormDto) {
    const existing = await this.prisma.form.findUnique({
      where: {
        subjectId_type: {
          subjectId: createFormDto.subjectId,
          type: createFormDto.type,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Form of type ${createFormDto.type} already exists for subject ${createFormDto.subjectId}`,
      );
    }

    return this.prisma.form.create({
      data: createFormDto,
      include: {
        template: true,
      },
    });
  }

  findAll() {
    return this.prisma.form.findMany({
      include: {
        template: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.form.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
            questionGroups: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
  }

  findPublic(id: number) {
    return this.prisma.form.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
            questionGroups: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        subject: {
          include: {
            class: {
              include: {
                institution: true,
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return this.prisma.form.update({
      where: { id },
      data: updateFormDto,
    });
  }

  remove(id: number) {
    return this.prisma.form.delete({
      where: { id },
    });
  }

  async remind(id: number) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!form) return;

    const studentEmails = form.subject.class.studentEmails.split(';');
    const formUrl = `${process.env.VITE_ALLOWED_HOST || 'http://localhost:5173'}/form/${form.id}`;

    for (const email of studentEmails) {
      if (email) {
        await this.mailService.sendFormReminderEmail(
          email,
          form.subject.name,
          formUrl,
        );
      }
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { InstitutionController } from './institution.controller';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { cleanDatabase, prisma } from '../test/hooks';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('InstitutionController', () => {
  let controller: InstitutionController;
  let service: InstitutionService;

  const institutions = [
    { id: 1, name: 'Institution One' },
    { id: 2, name: 'Institution Two' },
  ];

  const expectedRestoredInstitution = {
    id: 1,
    name: 'Institution One',
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstitutionController],
      providers: [
        {
          provide: InstitutionService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(institutions),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve(institutions.find((i) => i.id === id)),
              ),
            create: jest
              .fn()
              .mockImplementation((dto: CreateInstitutionDto) =>
                Promise.resolve({ id: 3, ...dto, deletedAt: null }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateInstitutionDto) =>
                Promise.resolve({ id, ...dto, deletedAt: null }),
              ),
            remove: jest.fn().mockResolvedValue(undefined),
            restore: jest.fn().mockResolvedValue(expectedRestoredInstitution),
          },
        },
      ],
    }).compile();

    controller = module.get<InstitutionController>(InstitutionController);
    service = module.get<InstitutionService>(InstitutionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return institutions on findAll', async () => {
    await expect(controller.findAll()).resolves.toEqual(institutions);
  });

  it('should return an institution on findOne', async () => {
    await expect(controller.findOne(1)).resolves.toEqual(institutions[0]);
  });

  it('should create an institution', async () => {
    const dto: CreateInstitutionDto = { name: 'New Institution' };
    await expect(controller.create(dto)).resolves.toMatchObject({
      id: 3,
      name: dto.name,
      deletedAt: null,
    });
  });

  it('should update an institution', async () => {
    const dto: UpdateInstitutionDto = { name: 'Updated Institution' };
    await expect(controller.update(1, dto)).resolves.toMatchObject({
      id: 1,
      name: dto.name,
      deletedAt: null,
    });
  });

  it('should remove an institution', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
  });

  it('should restore an institution', async () => {
    await expect(controller.restore(1)).resolves.toEqual(
      expectedRestoredInstitution,
    );
  });
});

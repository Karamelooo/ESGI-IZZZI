import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { cleanDatabase, prisma } from '../test/hooks';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const users = [
    {
      id: 1,
      fistName: 'Test',
      lastName: '1',
      email: 'test1@email.com',
      password: 'password1',
    },
    {
      id: 2,
      fistName: 'Test',
      lastName: '2',
      email: 'test2@email.com',
      password: 'password2',
    },
  ];

  const expectedRestoredUser = {
    id: 1,
    fistName: 'Test',
    lastName: '1',
    email: 'test1@email.com',
    password: 'password1',
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(users),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve(users.find((u) => u.id === id)),
              ),
            create: jest.fn().mockImplementation((dto: CreateUserDto) =>
              Promise.resolve({
                id: 3,
                ...dto,
                passwordHash: 'hash',
                deletedAt: null,
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((id: number, dto: UpdateUserDto) =>
                Promise.resolve({
                  id,
                  ...dto,
                  passwordHash: 'hash',
                  deletedAt: null,
                }),
              ),
            remove: jest.fn().mockResolvedValue(undefined),
            restore: jest.fn().mockResolvedValue(expectedRestoredUser),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return users on findAll', async () => {
    await expect(controller.findAll()).resolves.toEqual(users);
  });

  it('should return a user on findOne', async () => {
    await expect(controller.findOne(1)).resolves.toEqual(users[0]);
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      firstName: 'New',
      lastName: '1',
      email: 'new@email.com',
      password: '123456',
      institutionId: 1,
    };
    await expect(controller.create(dto)).resolves.toMatchObject({
      id: 3,
      email: dto.email,
      passwordHash: expect.any(String),
    });
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { email: 'updated@email.com' };
    await expect(controller.update(1, dto)).resolves.toMatchObject({
      id: 1,
      email: dto.email,
      passwordHash: expect.any(String),
    });
  });

  it('should remove a user', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
  });

  it('should restore a user', async () => {
    await expect(controller.restore(1)).resolves.toEqual(expectedRestoredUser);
  });
});

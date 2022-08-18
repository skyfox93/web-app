import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';

import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TEST_DB_OPTIONS } from '../testing-constants';
import { Organization } from '../../src/organizations/entities/organization.entity';
import { CreateOrganizationDto } from '../../src/organizations/dto/create-organization.dto';
import { Permission } from '../../src/permissions/entities/permission.entity';
import { CreatePermissionDto } from '../../src/permissions/dto/create-permission.dto';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { PermissionsModule } from '../../src/permissions/permissions.module';
import { PermissionsController } from '../../src/permissions/permissions.controller';
import { User } from '../../src/users/entities/user.entity';

import { StubGen } from '../stubs/stub-factory';
import { UsersModule } from '../../src/users/users.module';
import { OrganizationsModule } from '../../src/organizations/organizations.module';

describe('PermissionsController', () => {
  let app: INestApplication;
  let repository: Repository<Permission>;
  let userRepository: Repository<User>;
  let orgRepository: Repository<Organization>;

  const orgSeed: CreateOrganizationDto = StubGen.createOrgDto();

  const userSeed: CreateUserDto = StubGen.createUserDto();

  const permission: CreatePermissionDto = StubGen.createPermissionDto(userSeed, orgSeed);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PermissionsModule,
        TypeOrmModule.forRoot(TEST_DB_OPTIONS),
        UsersModule,
        OrganizationsModule,
      ],
      controllers: [PermissionsController],
      providers: [
        { provide: getRepositoryToken(Permission), useClass: Repository },
        { provide: getRepositoryToken(Organization), useClass: Repository },
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get(getRepositoryToken(Permission));
    userRepository = module.get(getRepositoryToken(User));
    orgRepository = module.get(getRepositoryToken(Organization));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const [savedUser, savedOrg] = await Promise.all([
      userRepository.createQueryBuilder().insert().into(User).values(userSeed).execute(),
      orgRepository.createQueryBuilder().insert().into(Organization).values(orgSeed).execute(),
    ]);
    const savedPermission = repository
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values({
        ...permission,
        user: { ...userSeed, id: savedUser.identifiers['id'] },
        organization: { ...orgSeed, id: savedOrg.identifiers['id'] },
      })
      .execute();
    expect(savedPermission).not.toBeNull();
  });

  afterEach(async () => {
    await repository.query(`TRUNCATE permissions CASCADE;`);
    await userRepository.query(`TRUNCATE users CASCADE;`);
    await orgRepository.query(`TRUNCATE organizations CASCADE;`);
  });

  it('POST /permissions -> when user exists should return 409', async () => {
    const requestBody = {
      ...permission,
      user: { ...userSeed },
      organization: { ...orgSeed, name: 'Something else', ein: '01-1234567' },
    };
    const { body } = await supertest
      .agent(app.getHttpServer())
      .post(`/permissions`)
      .send({ ...requestBody })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409);
    expect(body.message).toEqual('Email already exists');
  });

  it('POST /permissions -> when ORG exists by name should return 409', async () => {
    const requestBody = {
      ...permission,
      organization: { ...orgSeed, ein: '01-1234567' },
      user: { ...userSeed, email: 'anotheremail@test.com' },
    };

    const { body } = await supertest
      .agent(app.getHttpServer())
      .post(`/permissions`)
      .send({ ...requestBody })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409);
    expect(body.message).toEqual('This organization already exists');
  });

  it('POST /permissions -> when ORG exists by EIN should return 409', async () => {
    const requestBody = {
      ...permission,
      organization: { ...orgSeed, name: 'anything' },
      user: { ...userSeed, email: 'anyrandomemail@test.com' },
    };

    const { body } = await supertest
      .agent(app.getHttpServer())
      .post(`/permissions`)
      .send({ ...requestBody })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409);
    expect(body.message).toEqual('This organization already exists');
  });

  it('POST /permissions -> when unique, should return 201', async () => {
    const requestBody = {
      ...permission,
      user: { ...userSeed, email: 'somethingelse@no.com' },
      organization: {
        ...orgSeed,
        name: 'Anything else',
        ein: '01-1234567',
      },
    };

    const { body } = await supertest
      .agent(app.getHttpServer())
      .post(`/permissions`)
      .send({ ...requestBody })
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
    expect(body.message).toBeUndefined();
  });
});

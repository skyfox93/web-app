import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { CreateOrganizationDto } from '../../src/organizations/dto/create-organization.dto';
import { CreatePermissionDto } from '../../src/permissions/dto/create-permission.dto';
import { ApprovalStatus, Role } from '../../src/permissions/constants';

/**
 * Generates stubs using a faker library
 */
export class StubGen {
  /**
   *
   * @returns CreateUserDto
   */
  public static createUserDto(): CreateUserDto {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'Secret1234%',
    };
  }

  public static createOrgDto(): CreateOrganizationDto {
    const COMPANY_NAME = faker.company.name();
    return {
      name: COMPANY_NAME,
      doing_business_as: COMPANY_NAME,
      description: faker.lorem.paragraph(),
      website: faker.internet.url(),
      address: faker.address.streetAddress(),
      phone: '123-456-7891',
      city: faker.address.city(),
      state: faker.address.state(),
      ein: `${faker.random.numeric(2, { allowLeadingZeros: false })}-${faker.random.numeric(6, {
        allowLeadingZeros: false,
      })}`,
      nonprofit_classification: 'FAKE',
    };
  }

  public static createPermissionDto(
    createUserDto: CreateUserDto,
    createOrgDto: CreateOrganizationDto,
  ): CreatePermissionDto {
    return {
      role: Role.owner,
      approvalStatus: ApprovalStatus.approved,
      organization: { ...createOrgDto },
      user: { ...createUserDto },
    };
  }
}

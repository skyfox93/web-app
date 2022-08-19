import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { CreateOrganizationDto } from '../../organizations/dto/create-organization.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

import { ApprovalStatus, Role } from '../constants';

export class CreatePermissionDto {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus: ApprovalStatus;

  @IsNotEmpty({ message: 'org_id is required' })
  // allow creating a permission with a new or existing org
  organization: Organization | CreateOrganizationDto;

  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsNotEmpty({ message: 'user_id is required' })
  // allow creating a permission with a new or existing user
  user: User | CreateUserDto;
}

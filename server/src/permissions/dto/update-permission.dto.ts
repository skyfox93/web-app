import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

import { CreatePermissionDto } from './create-permission.dto';
import { ApprovalStatus, Role } from '../constants';

export class UpdatePermissionDto {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus: ApprovalStatus;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}

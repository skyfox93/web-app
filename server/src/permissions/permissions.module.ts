import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Organization])],
  controllers: [PermissionsController],
  providers: [PermissionsService, UsersService, OrganizationsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}

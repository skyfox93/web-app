import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationsService } from '../organizations/organizations.service';
import { UsersService } from '../users/users.service';

import type { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    private userService: UsersService,
    private organizationsService: OrganizationsService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const userExists = this.userService.userEmailExists(createPermissionDto.user.email);

    const existingOrg = this.organizationsService.countByNameOrEin(
      createPermissionDto.organization.name,
      createPermissionDto.organization.ein,
    );

    const [userExistsAsync, existingOrgAsync] = await Promise.all([userExists, existingOrg]);

    if (userExistsAsync && existingOrgAsync > 0) {
      return null;
    } else {
      const user = await this.userService.create(createPermissionDto.user);
      const organization = await this.organizationsService.create(createPermissionDto.organization);

      try {
        return await this.permissionsRepository.save({
          ...createPermissionDto,
          id: 0,
          user: { ...user, id: user.id ?? 0 },
          organization: { ...organization, id: organization.id ?? 0 },
        });
      } catch (err) {
        Logger.error(err, PermissionsService.name);
      }
    }
  }

  async findAll(): Promise<Permission[]> {
    const allPermissions = await this.permissionsRepository.find();
    return allPermissions;
  }

  async findBy(user: User, org: Organization): Promise<Permission> {
    const match = await this.permissionsRepository.findOneBy({
      user: { id: user.id },
      organization: { id: org.id },
    });
    console.log('match', match);
    return match;
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionsRepository.findOneBy({ id });
    return permission;
  }

  async update(id: number, updatePermissionsDto: UpdatePermissionDto): Promise<Permission> {
    await this.permissionsRepository.update(id, updatePermissionsDto);
    return this.permissionsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    const removedPermission = await this.permissionsRepository.delete(id);
    return removedPermission;
  }
}

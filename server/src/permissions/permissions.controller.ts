import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { Organization } from '../organizations/entities/organization.entity';
import { User } from '../users/entities/user.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly userService: UsersService,
    private readonly orgService: OrganizationsService,
  ) {}

  @Post()
  async create(@Body() createPermissionsDto: CreatePermissionDto): Promise<Permission> {
    if (
      createPermissionsDto.user.hasOwnProperty('id') &&
      createPermissionsDto.organization.hasOwnProperty('id') &&
      this.permissionsService.findBy(
        createPermissionsDto.user as User,
        createPermissionsDto.organization as Organization,
      )
    ) {
      throw new HttpException(
        { staus: HttpStatus.NOT_FOUND, message: 'permission already exists, try PATCH' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.permissionsService.create(createPermissionsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
    const permission = await this.permissionsService.findOne(id);
    if (!permission) {
      throw new HttpException(
        { staus: HttpStatus.NOT_FOUND, message: 'User relation to Organization not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return permission;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    try {
      const updatedPermission = await this.permissionsService.update(id, updatePermissionDto);
      return updatedPermission;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, message: `${error}` },
        HttpStatus.CONFLICT,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    const permissionToDelete = await this.permissionsService.remove(id);
    if (permissionToDelete.affected === 0) {
      throw new HttpException(
        { staus: HttpStatus.NOT_FOUND, message: 'User relation to Organization not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return permissionToDelete;
  }
}

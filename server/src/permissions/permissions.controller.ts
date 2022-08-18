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
import { ApprovalStatus, Role } from './constants';
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly userService: UsersService,
    private readonly orgService: OrganizationsService,
  ) {}

  @Post()
  async create(@Body() createPermissionsDto: CreatePermissionDto): Promise<Permission> {
    if (await this.userService.userEmailExists(createPermissionsDto.user.email)) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, message: 'Email already exists' },
        HttpStatus.CONFLICT,
      );
    }

    if (
      (await this.orgService.countByNameOrEin(
        createPermissionsDto.organization.name,
        createPermissionsDto.organization.ein,
      )) > 0
    ) {
      throw new HttpException(
        { status: HttpStatus.CONFLICT, message: 'This organization already exists' },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const permission = await this.permissionsService.create({
        ...createPermissionsDto,
        role: Role.owner,
        approvalStatus: ApprovalStatus.pending,
      });
      return permission;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

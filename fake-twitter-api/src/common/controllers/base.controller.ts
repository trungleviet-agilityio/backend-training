import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BaseService } from '../services';
import { ObjectLiteral } from 'typeorm';
import { ApiDocs } from '../decorators/api-docs.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GlobalResponseDto } from '../dto';

@ApiTags('Base')
@Controller()
@UseGuards(JwtAuthGuard) // Use JwtAuthGuard instead of generic AuthGuard
export abstract class BaseController<T extends ObjectLiteral> {
  /**
   * Constructor
   * @param service - The service for the base controller
   */

  constructor(protected readonly service: BaseService<T>) {}

  @Get(':uuid')
  @ApiDocs({
    summary: 'Get resource by ID',
    description: 'Retrieve a resource by its ID',
    auth: true,
    responses: {
      200: {
        description: 'Resource retrieved successfully',
        type: GlobalResponseDto,
      },
    },
  })
  async findById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<T> {
    /**
     * Find a resource by its ID
     * @param uuid - The UUID of the resource
     * @returns The resource
     */

    return this.service.findById(uuid);
  }

  @Get()
  @ApiDocs({
    summary: 'Get all resources',
    description: 'Retrieve all resources',
    auth: true,
    responses: {
      200: {
        description: 'Resources retrieved successfully',
        type: GlobalResponseDto,
      },
    },
  })
  async findAll(): Promise<T[]> {
    /**
     * Find all resources
     * @returns The resources
     */

    return this.service.findAll();
  }

  @Post()
  @ApiDocs({
    summary: 'Create a resource',
    description: 'Create a new resource',
    auth: true,
    responses: {
      201: {
        description: 'Resource created successfully',
        type: GlobalResponseDto,
      },
    },
  })
  async create(@Body() createDto: T): Promise<T> {
    /**
     * Create a resource
     * @param createDto - The data for the resource
     * @returns The created resource
     */

    return this.service.create(createDto);
  }

  @Put(':uuid')
  @ApiDocs({
    summary: 'Update a resource',
    description: 'Update an existing resource',
    auth: true,
    responses: {
      200: {
        description: 'Resource updated successfully',
        type: GlobalResponseDto,
      },
    },
  })
  async update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() updateDto: T): Promise<T> {
    /**
     * Update a resource
     * @param uuid - The UUID of the resource
     * @param updateDto - The data for the resource
     * @returns The updated resource
     */

    return this.service.update(uuid, updateDto);
  }

  @Delete(':uuid')
  @ApiDocs({
    summary: 'Delete a resource',
    description: 'Delete an existing resource',
    auth: true,
    responses: {
      200: {
        description: 'Resource deleted successfully',
        type: GlobalResponseDto,
      },
    },
  })
  async delete(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<void> {
    /**
     * Delete a resource
     * @param uuid - The UUID of the resource
     * @returns The deleted resource
     */

    return this.service.delete(uuid);
  }
}

/**
 * Base service for all services
 *
 * This service is used to provide a base implementation for all services.
 * It is used to provide a base implementation for all services.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  /**
   * Constructor
   * @param repository - The repository for the base service
   */

  constructor(protected readonly repository: Repository<T>) {}

  async findById(uuid: string): Promise<T> {
    /**
     * Find a resource by its ID
     * @param uuid - The UUID of the resource
     * @returns The resource
     */

    const entity = await this.repository.findOne({ where: { uuid } as any });
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findAll(): Promise<T[]> {
    /**
     * Find all resources
     * @returns The resources
     */

    return this.repository.find();
  }

  async create(data: Partial<T>): Promise<T> {
    /**
     * Create a resource
     * @param data - The data for the resource
     * @returns The created resource
     */

    const entity = this.repository.create(data as any);
    return this.repository.save(entity as any);
  }

  async update(uuid: string, data: Partial<T>): Promise<T> {
    /**
     * Update a resource
     * @param uuid - The UUID of the resource
     * @param data - The data for the resource
     * @returns The updated resource
     */

    await this.repository.update(uuid, data as any);
    return this.findById(uuid);
  }

  async delete(uuid: string): Promise<void> {
    /**
     * Delete a resource
     * @param uuid - The UUID of the resource
     * @returns The deleted resource
     */

    const entity = await this.findById(uuid);
    await this.repository.softRemove(entity as any);
  }
}

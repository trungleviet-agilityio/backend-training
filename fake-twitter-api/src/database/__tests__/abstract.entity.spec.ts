/**
 * This file contains the tests for the abstract entity.
 */

import { AbstractEntity } from '../abstract.entity';

describe('AbstractEntity', () => {
  class TestEntity extends AbstractEntity<TestEntity> {
    foo?: string;
    constructor(entity: Partial<TestEntity> = {}) {
      super(entity);
      Object.assign(this, entity);
    }
  }

  it('should assign properties from constructor', () => {
    const now = new Date();
    const entity = new TestEntity({
      uuid: 'id',
      foo: 'bar',
      createdAt: now,
      updatedAt: now,
      deleted: false,
    });
    expect(entity.uuid).toBe('id');
    expect(entity.foo).toBe('bar');
    expect(entity.createdAt).toBe(now);
    expect(entity.updatedAt).toBe(now);
    expect(entity.deleted).toBe(false);
  });

  it('should update updatedAt on updateUpdatedAt call', () => {
    const entity = new TestEntity();
    const before = entity.updatedAt;
    entity.updateUpdatedAt();
    expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(
      before ? before.getTime() : 0,
    );
  });

  it('should support soft delete fields', () => {
    const entity = new TestEntity({ deleted: true, deletedAt: new Date() });
    expect(entity.deleted).toBe(true);
    expect(entity.deletedAt).toBeInstanceOf(Date);
  });
});

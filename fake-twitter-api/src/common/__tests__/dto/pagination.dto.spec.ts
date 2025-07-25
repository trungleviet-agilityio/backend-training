/**
 * This file contains the tests for the pagination DTOs.
 */

import {
  PaginatedResponseDto,
  PaginationDto,
  PaginationMetaDto,
} from '../../dto/pagination.dto';

describe('Pagination DTOs', () => {
  it('should instantiate PaginationDto with defaults', () => {
    const dto = new PaginationDto();
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });
  it('should instantiate PaginationMetaDto and PaginatedResponseDto', () => {
    const meta = new PaginationMetaDto();
    meta.page = 2;
    meta.limit = 5;
    meta.total = 100;
    meta.totalPages = 20;
    meta.hasNext = true;
    meta.hasPrev = false;
    expect(meta.page).toBe(2);
    expect(meta.totalPages).toBe(20);
    const resp = new PaginatedResponseDto<number>();
    resp.items = [1, 2, 3];
    resp.meta = meta;
    expect(resp.items).toEqual([1, 2, 3]);
    expect(resp.meta).toBe(meta);
  });
});

/**
 * This file contains the tests for the API response DTOs.
 */

import {
  BaseApiResponse,
  SuccessResponse,
  ErrorResponse,
  PaginationMeta,
  PaginatedData,
  PaginatedResponse,
  CollectionResponse,
  MessageResponse,
  CreatedResponse,
  UpdatedResponse,
  DeletedResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  ValidationErrorResponse,
  ConflictResponse,
} from '../../dto/api-response.dto';

describe('API Response DTOs', () => {
  it('should construct BaseApiResponse and SuccessResponse', () => {
    const base = new BaseApiResponse({ success: true, message: 'ok', data: 1 });
    expect(base.success).toBe(true);
    expect(base.message).toBe('ok');
    expect(base.data).toBe(1);

    const success = new SuccessResponse('data', 'msg');
    expect(success.success).toBe(true);
    expect(success.message).toBe('msg');
    expect(success.data).toBe('data');
  });
  it('should construct ErrorResponse and subclasses', () => {
    const err = new ErrorResponse('fail', ['e1'], 400, '/p');
    expect(err.success).toBe(false);
    expect(err.errors).toContain('e1');
    expect(err.statusCode).toBe(400);
    expect(err.path).toBe('/p');
    expect(new NotFoundResponse('Thing', 1).statusCode).toBe(404);
    expect(new UnauthorizedResponse().statusCode).toBe(401);
    expect(new ForbiddenResponse().statusCode).toBe(403);
    expect(new ValidationErrorResponse(['bad']).statusCode).toBe(422);
    expect(new ConflictResponse().statusCode).toBe(409);
  });
  it('should construct pagination and collection responses', () => {
    const meta = new PaginationMeta(2, 10, 50);
    expect(meta.page).toBe(2);
    expect(meta.totalPages).toBe(5);
    const paginated = new PaginatedData([1, 2], meta);
    expect(paginated.items).toEqual([1, 2]);
    expect(paginated.meta).toBe(meta);
    const paginatedResp = new PaginatedResponse([1, 2], meta);
    expect(paginatedResp.success).toBe(true);
    expect(paginatedResp.data?.items).toEqual([1, 2]);
    const coll = new CollectionResponse([1, 2, 3]);
    expect(coll.count).toBe(3);
    expect(coll.data).toEqual([1, 2, 3]);
  });
  it('should construct message and CRUD responses', () => {
    expect(new MessageResponse('hi').message).toBe('hi');
    expect(new CreatedResponse('x').message).toMatch(/created/i);
    expect(new UpdatedResponse('y').message).toMatch(/updated/i);
    expect(new DeletedResponse().message).toMatch(/deleted/i);
  });
});

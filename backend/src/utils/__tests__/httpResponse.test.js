import { successResponse, errorResponse, paginatedResponse } from '../httpResponse.js';

describe('successResponse', () => {
  it('sends default success response', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    successResponse(res, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: { id: 1 },
    });
  });

  it('uses custom message and status', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    successResponse(res, { id: 1 }, 'Created', 201);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Created',
      data: { id: 1 },
    });
  });
});

describe('errorResponse', () => {
  it('sends default error response', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorResponse(res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
  });

  it('includes errors array when provided', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorResponse(res, 'Validation failed', 422, ['Name is required', 'Email is required']);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      errors: ['Name is required', 'Email is required'],
    });
  });
});

describe('paginatedResponse', () => {
  it('sends paginated response with computed totalPages', () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const items = [{ id: 1 }, { id: 2 }];
    paginatedResponse(res, items, 20, 1, 10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: items,
      pagination: {
        total: 20,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
    });
  });
});

import { describe, it, expect } from 'vitest';
import { AppError } from './AppError';

describe('AppError', () => {
  it('should create an error with default values', () => {
    const error = new AppError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe('AppError');
  });

  it('should create an error with custom values', () => {
    const error = new AppError('Not found', 'NOT_FOUND', 404);
    
    expect(error.message).toBe('Not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });
});

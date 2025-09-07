// Generic Prisma CRUD service

import { log } from './logger';
import { AppError, ValidationError, NotFoundError } from './errors';

export class DbService<T extends { id: any }> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findMany(args?: any): Promise<T[]> {
    try {
      return await this.model.findMany(args);
    } catch (error) {
      log('DbService.findMany error', { error, args, type: 'query' }, 'error');
      throw new AppError('Database findMany failed', 'DB_FIND_MANY_ERROR', 500, error);
    }
  }

  async findUnique(args: any): Promise<T | null> {
    try {
      const result = await this.model.findUnique(args);
      if (!result) {
        throw new NotFoundError('Record not found', args);
      }
      return result;
    } catch (error) {
      log('DbService.findUnique error', { error, args, type: 'query' }, 'error');
      throw error instanceof AppError ? error : new AppError('Database findUnique failed', 'DB_FIND_UNIQUE_ERROR', 500, error);
    }
  }

  async create(args: any): Promise<T> {
    try {
      return await this.model.create(args);
    } catch (error) {
      log('DbService.create error', { error, args, type: 'mutation' }, 'error');
      throw new ValidationError('Database create failed', error);
    }
  }

  async update(args: any): Promise<T> {
    try {
      return await this.model.update(args);
    } catch (error) {
      log('DbService.update error', { error, args, type: 'mutation' }, 'error');
      throw new AppError('Database update failed', 'DB_UPDATE_ERROR', 500, error);
    }
  }

  async delete(args: any): Promise<T> {
    try {
      return await this.model.delete(args);
    } catch (error) {
      log('DbService.delete error', { error, args, type: 'mutation' }, 'error');
      throw new AppError('Database delete failed', 'DB_DELETE_ERROR', 500, error);
    }
  }

  async count(args?: any): Promise<number> {
    try {
      return await this.model.count(args);
    } catch (error) {
      log('DbService.count error', { error, args, type: 'query' }, 'error');
      throw new AppError('Database count failed', 'DB_COUNT_ERROR', 500, error);
    }
  }
}

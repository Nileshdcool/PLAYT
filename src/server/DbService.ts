// Generic Prisma CRUD service
import type { PrismaClient, Prisma } from '@prisma/client';

export class DbService<T extends { id: any }> {
  private model: any;

  constructor(model: any) {
    this.model = model;
  }

  async findMany(args?: any): Promise<T[]> {
    return this.model.findMany(args);
  }

  async findUnique(args: any): Promise<T | null> {
    return this.model.findUnique(args);
  }

  async create(args: any): Promise<T> {
    return this.model.create(args);
  }

  async update(args: any): Promise<T> {
    return this.model.update(args);
  }

  async delete(args: any): Promise<T> {
    return this.model.delete(args);
  }

  async count(args?: any): Promise<number> {
    return this.model.count(args);
  }
}

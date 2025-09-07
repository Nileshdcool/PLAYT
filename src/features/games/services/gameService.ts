
import { z } from "zod";
import type { Game, Prisma } from "@prisma/client";
import { db } from "~/server/db";
import { DbService } from "~/server/DbService";
import { log } from "~/server/logger";
import { AppError, ValidationError } from "~/server/errors";

// Define input schemas for service layer
const ListGamesInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortColumn: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const AddGameInput = z.object({
  title: z.string(),
  genre: z.string(),
  platform: z.string(),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  developer: z.string(),
  price: z.number().min(0),
  multiplayer: z.boolean(),
  metascore: z.number().int().min(0).max(100),
});

const ReleaseYearStatsInput = z.object({
  startYear: z.number().int().min(1970),
  endYear: z.number().int().min(1970),
  sortColumn: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const ListGamesByGenreAndPeriodInput = z.object({
  genre: z.string(),
  startYear: z.number().int().min(1970),
  endYear: z.number().int().min(1970),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortColumn: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Service layer implementation
const gameDbService = new DbService<Game>(db.game);

export const gameService = {
  async listGames(input: z.infer<typeof ListGamesInput>) {
    try {
      const { page, limit, search, sortColumn, sortOrder } = input;
      const skip = (page - 1) * limit;
      const where: Prisma.GameWhereInput = search
        ? {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }
        : {};
      const validSortColumns = [
        'title', 'genre', 'platform', 'releaseDate', 'developer', 'price', 'metascore'
      ];
      let orderBy: Prisma.GameOrderByWithRelationInput = { releaseDate: 'desc' };
      if (sortColumn && validSortColumns.includes(sortColumn)) {
        orderBy = { [sortColumn]: sortOrder ?? 'asc' } as Prisma.GameOrderByWithRelationInput;
      }
      const [games, total] = await Promise.all([
        gameDbService.findMany({
          where,
          skip,
          take: limit,
          orderBy,
        }),
        gameDbService.count({ where }),
      ]);
      return {
        success: true,
        data: {
          games,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      log('gameService.listGames error', { error, args: input }, 'error');
      throw new AppError(error?.message || 'Failed to list games', 'LIST_GAMES_ERROR', 500, error);
    }
  },

  async addGame(input: z.infer<typeof AddGameInput>) {
    try {
      const game = await gameDbService.create({
        data: {
          ...input,
          releaseDate: new Date(input.releaseDate),
        },
      });
      return {
        success: true,
        data: game,
      };
    } catch (error: any) {
      log('gameService.addGame error', { error, args: input }, 'error');
      throw new ValidationError(error?.message || 'Failed to add game', error);
    }
  },

  async getReleaseYearStats(input: z.infer<typeof ReleaseYearStatsInput>) {
    try {
      const { startYear, endYear, sortColumn, sortOrder } = input;
      const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);
      // Only allow valid columns for sorting
      const validSortColumns = [
        'genre', 'count', 'avgPrice', 'highestMetascore', 'lowestMetascore'
      ];
      let groupByArgs: any = {
        by: ['genre'],
        where: {
          releaseDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: {
          _all: true,
        },
        _avg: {
          price: true,
        },
        _max: {
          metascore: true,
        },
        _min: {
          metascore: true,
        },
      };
      if (sortColumn === 'genre') {
        groupByArgs.orderBy = { genre: sortOrder ?? 'asc' };
      }
      const stats = await db.game.groupBy(groupByArgs);
      type StatResult = {
        genre: string;
        count: number;
        avgPrice: number | null;
        highestMetascore: number | null;
        lowestMetascore: number | null;
      };
      let result: StatResult[] = stats.map((s: any) => ({
        genre: s.genre,
        count: s._count?._all ?? 0,
        avgPrice: s._avg?.price ?? null,
        highestMetascore: s._max?.metascore ?? null,
        lowestMetascore: s._min?.metascore ?? null,
      }));
      if (sortColumn && ['count', 'avgPrice', 'highestMetascore', 'lowestMetascore'].includes(sortColumn)) {
        result = result.sort((a: StatResult, b: StatResult) => {
          const dir = sortOrder === 'desc' ? -1 : 1;
          const aVal = a[sortColumn as keyof StatResult];
          const bVal = b[sortColumn as keyof StatResult];
          if (aVal === null && bVal === null) return 0;
          if (aVal === null) return 1 * dir;
          if (bVal === null) return -1 * dir;
          if (aVal < bVal) return -1 * dir;
          if (aVal > bVal) return 1 * dir;
          return 0;
        });
      }
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      log('gameService.getReleaseYearStats error', { error, args: input }, 'error');
      throw new AppError(error?.message || 'Failed to get release year stats', 'RELEASE_YEAR_STATS_ERROR', 500, error);
    }
  },

  async listGamesByGenreAndPeriod(input: z.infer<typeof ListGamesByGenreAndPeriodInput>) {
    try {
      const { genre, startYear, endYear, page, limit, sortColumn, sortOrder } = input;
      const skip = (page - 1) * limit;
      const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
      const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);
      const where: Prisma.GameWhereInput = {
        genre,
        releaseDate: {
          gte: startDate,
          lte: endDate,
        },
      };
      const validSortColumns = [
        'title', 'platform', 'releaseDate', 'developer', 'price', 'metascore'
      ];
      let orderBy: Prisma.GameOrderByWithRelationInput = { releaseDate: 'desc' };
      if (sortColumn && validSortColumns.includes(sortColumn)) {
        orderBy = { [sortColumn]: sortOrder ?? 'asc' } as Prisma.GameOrderByWithRelationInput;
      }
      const [games, total] = await Promise.all([
        gameDbService.findMany({
          where,
          skip,
          take: limit,
          orderBy,
        }),
        gameDbService.count({ where }),
      ]);
      return {
        success: true,
        data: {
          games,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      log('gameService.listGamesByGenreAndPeriod error', { error, args: input }, 'error');
      throw new AppError(error?.message || 'Failed to list games by genre and period', 'LIST_GAMES_BY_GENRE_PERIOD_ERROR', 500, error);
    }
  },
};

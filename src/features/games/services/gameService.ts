import { db } from "~/server/db";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

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
export const gameService = {
  async listGames(input: z.infer<typeof ListGamesInput>) {
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

    // Only allow valid columns for sorting
    const validSortColumns = [
      'title', 'genre', 'platform', 'releaseDate', 'developer', 'price', 'metascore'
    ];
    let orderBy: Prisma.GameOrderByWithRelationInput = { releaseDate: 'desc' };
    if (sortColumn && validSortColumns.includes(sortColumn)) {
      orderBy = { [sortColumn]: sortOrder ?? 'asc' } as Prisma.GameOrderByWithRelationInput;
    }

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      db.game.count({ where }),
    ]);
    return {
      games,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async addGame(input: z.infer<typeof AddGameInput>) {
    const game = await db.game.create({
      data: {
        ...input,
        releaseDate: new Date(input.releaseDate),
      },
    });
    return game;
  },

  async getReleaseYearStats(input: z.infer<typeof ReleaseYearStatsInput>) {
    const { startYear, endYear } = input;
    const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);

    const stats = await db.game.groupBy({
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
      orderBy: { genre: 'asc' },
    });

    return stats.map(s => ({
      genre: s.genre,
      count: (s._count as any)?._all ?? 0,
      avgPrice: (s._avg as any)?.price ?? null,
      highestMetascore: (s._max as any)?.metascore ?? null,
      lowestMetascore: (s._min as any)?.metascore ?? null,
    }));
  },

  async listGamesByGenreAndPeriod(input: z.infer<typeof ListGamesByGenreAndPeriodInput>) {
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

    // Only allow valid columns for sorting
    const validSortColumns = [
      'title', 'platform', 'releaseDate', 'developer', 'price', 'metascore'
    ];
    let orderBy: Prisma.GameOrderByWithRelationInput = { releaseDate: 'desc' };
    if (sortColumn && validSortColumns.includes(sortColumn)) {
      orderBy = { [sortColumn]: sortOrder ?? 'asc' } as Prisma.GameOrderByWithRelationInput;
    }

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      db.game.count({ where }),
    ]);
    return {
      games,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },
};

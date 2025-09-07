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
    // Only pass orderBy if sorting by genre (Prisma only supports sorting by grouped fields)
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

    // If sorting by aggregate columns, sort in JS (since Prisma groupBy only supports sorting by grouped fields)
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
    return result;
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

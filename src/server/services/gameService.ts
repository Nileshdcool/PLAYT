import { db } from "~/server/db";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

// Define input schemas for service layer
const ListGamesInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
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
});

// Service layer implementation
export const gameService = {
  async listGames(input: z.infer<typeof ListGamesInput>) {
    const { page, limit, search } = input;
    const skip = (page - 1) * limit;

    const where: Prisma.GameWhereInput = search
      ? {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
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
      orderBy: {
        genre: 'asc'
      },
    });

    return stats.map(s => ({
        genre: s.genre,
        count: s._count._all,
        avgPrice: s._avg.price,
        highestMetascore: s._max.metascore,
        lowestMetascore: s._min.metascore,
    }));
  },

  async listGamesByGenreAndPeriod(input: z.infer<typeof ListGamesByGenreAndPeriodInput>) {
    const { genre, startYear, endYear, page, limit } = input;
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

    const [games, total] = await Promise.all([
      db.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: { releaseDate: 'desc' },
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

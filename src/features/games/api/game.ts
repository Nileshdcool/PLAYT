import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../../server/api/trpc";
import { z } from "zod";
import { gameService } from "../../../features/games/services/gameService";

export const gameRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      search: z.string().optional(),
      sortColumn: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }))
    .query(async ({ input }) => {
      const result = await gameService.listGames(input);
      return result;
    }),

  add: protectedProcedure
    .input(z.object({
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
    }))
    .mutation(async ({ input }) => {
      const result = await gameService.addGame(input);
      return result;
    }),
    
  releaseYearStats: publicProcedure
    .input(z.object({
      startYear: z.number().int().min(1970),
      endYear: z.number().int().min(1970),
      sortColumn: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }))
    .query(async ({ input }) => {
      const result = await gameService.getReleaseYearStats(input);
      return result;
    }),

  listGamesByGenreAndPeriod: publicProcedure
    .input(z.object({
      genre: z.string(),
      startYear: z.number().int().min(1970),
      endYear: z.number().int().min(1970),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      sortColumn: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }))
    .query(async ({ input }) => {
      const result = await gameService.listGamesByGenreAndPeriod(input);
      return result;
    }),
});

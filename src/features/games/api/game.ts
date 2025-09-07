import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { gameService } from "~/features/games/services/gameService";

export const gameRouter = createTRPCRouter({
  // Public endpoint (e.g., list games)
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      search: z.string().optional(),
      sortColumn: z.string().optional(),
      sortOrder: z.enum(["asc", "desc"]).optional(),
    }))
    .query(async ({ input }) => {
      return gameService.listGames(input);
    }),

  // Protected endpoint (e.g., add a game)
  add: protectedProcedure
    .input(z.object({
      title: z.string(),
      genre: z.string(),
      platform: z.string(),
      releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }), // ISO date string
      developer: z.string(),
      price: z.number().min(0),
      multiplayer: z.boolean(),
      metascore: z.number().int().min(0).max(100),
    }))
    .mutation(async ({ input }) => {
      return gameService.addGame(input);
    }),
    
  // Public endpoint: release year range stats
  releaseYearStats: publicProcedure
    .input(z.object({
      startYear: z.number().int().min(1970),
      endYear: z.number().int().min(1970),
    }))
    .query(async ({ input }) => {
      return gameService.getReleaseYearStats(input);
    }),

  // Public endpoint: list games by genre and period (for drill-down)
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
      return gameService.listGamesByGenreAndPeriod(input);
    }),
});
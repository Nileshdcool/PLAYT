import { z } from "zod";

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  genre: z.string(),
  platform: z.string(),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  developer: z.string(),
  price: z.number().min(0),
  metascore: z.number().int().min(0).max(100),
  multiplayer: z.boolean(),
});

export const GameListPropsSchema = z.object({
  games: z.array(GameSchema),
  isLoading: z.boolean(),
  error: z.any(),
});

export const GamePaginationPropsSchema = z.object({
  page: z.number().min(1),
  totalPages: z.number().min(1),
  onPageChange: z.function().args(z.number()).returns(z.void()),
});

export const GameSearchPropsSchema = z.object({
  value: z.string(),
  onChange: z.function().args(z.string()).returns(z.void()),
});

export type Game = z.infer<typeof GameSchema>;
export type GameListProps = z.infer<typeof GameListPropsSchema>;
export type GamePaginationProps = z.infer<typeof GamePaginationPropsSchema>;
export type GameSearchProps = z.infer<typeof GameSearchPropsSchema>;

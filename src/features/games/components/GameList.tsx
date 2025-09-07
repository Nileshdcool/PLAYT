import React from "react";
import type { Game, GameListProps } from "../types/game";
import GameListItem from "./GameListItem";

const GameList: React.FC<GameListProps> = ({ games, isLoading, error }) => {
  return (
    <div className="w-full max-w-2xl bg-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Games</h2>
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      )}
      {error && <p className="text-red-500">Error loading games.</p>}
      {games.length === 0 && !isLoading && !error && (
        <p className="text-white">No games found.</p>
      )}
      {games.length > 0 && (
        <ul className="divide-y divide-white/20">
          {games.map((game) => (
            <GameListItem key={game.id} game={game} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameList;

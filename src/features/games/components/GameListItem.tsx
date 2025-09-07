import React from "react";
import type { Game } from "../types/game";

interface GameListItemProps {
  game: Game;
}

const GameListItem: React.FC<GameListItemProps> = ({ game }) => (
  <li className="py-4">
    <div className="flex flex-col">
      <span className="text-lg font-semibold text-white">{game.title}</span>
      <span className="text-sm text-white/80">Genre: {game.genre} | Platform: {game.platform}</span>
      <span className="text-sm text-white/80">Release: {game.releaseDate.slice(0, 10)}</span>
      <span className="text-sm text-white/80">Developer: {game.developer}</span>
      <span className="text-sm text-white/80">Price: ${game.price.toFixed(2)} | Metascore: {game.metascore}</span>
      <span className="text-sm text-white/80">Multiplayer: {game.multiplayer ? "Yes" : "No"}</span>
    </div>
  </li>
);

export default GameListItem;

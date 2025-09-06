import React from "react";

interface GameListHeaderProps {
  onAddGame: () => void;
}

const GameListHeader: React.FC<GameListHeaderProps> = ({ onAddGame }) => (
  <div className="relative w-full text-center">
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
      Game <span className="text-[hsl(280,100%,70%)]">List</span>
    </h1>
    <button
      onClick={onAddGame}
      className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      Add Game
    </button>
  </div>
);

export default GameListHeader;

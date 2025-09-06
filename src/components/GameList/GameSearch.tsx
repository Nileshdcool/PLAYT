import React from "react";
import type { GameSearchProps } from "../../types/game";

const GameSearch: React.FC<GameSearchProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6 w-full max-w-2xl">
      <input
        type="text"
        className="w-full rounded-lg p-3 text-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-md transition duration-150"
        placeholder="Search games by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontWeight: "500", letterSpacing: "0.5px" }}
      />
    </div>
  );
};

export default GameSearch;

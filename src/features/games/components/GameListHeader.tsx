import React from "react";

interface GameListHeaderProps {
  onAddGame: () => void;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  onSortColumnChange: (col: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const GameListHeader: React.FC<GameListHeaderProps> = ({
  onAddGame,
  sortColumn,
  sortOrder,
  onSortColumnChange,
  onSortOrderChange,
}) => (
  <div className="relative w-full text-center">
    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
      Game <span className="text-[hsl(280,100%,70%)]">List</span>
    </h1>
    <div className="flex flex-row items-center justify-center gap-4 mt-4 mb-2">
      <label className="text-white font-medium">Sort By:</label>
      <select
        id="sortColumn"
        className="rounded p-2 text-black bg-white border border-gray-300"
        style={{ minWidth: 120 }}
        value={sortColumn}
        onChange={e => onSortColumnChange(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="genre">Genre</option>
        <option value="platform">Platform</option>
        <option value="releaseDate">Release Date</option>
        <option value="developer">Developer</option>
        <option value="price">Price</option>
        <option value="metascore">Metascore</option>
      </select>
      <select
        id="sortOrder"
        className="rounded p-2 text-black bg-white border border-gray-300"
        style={{ minWidth: 100 }}
        value={sortOrder}
        onChange={e => onSortOrderChange(e.target.value as 'asc' | 'desc')}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <button
      onClick={onAddGame}
      className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      Add Game
    </button>
  </div>
);

export default GameListHeader;

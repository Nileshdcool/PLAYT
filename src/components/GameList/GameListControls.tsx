import React from "react";
import PageSizeSelector from "./PageSizeSelector";
import GamePagination from "./GamePagination";

interface GameListControlsProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  showPagination: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const GameListControls: React.FC<GameListControlsProps> = ({
  pageSize,
  onPageSizeChange,
  showPagination,
  page,
  totalPages,
  onPageChange,
}) => (
  <div className="flex flex-row items-center justify-between w-full max-w-2xl mt-8 px-4 py-3 bg-white/10 rounded-lg shadow">
    <PageSizeSelector pageSize={pageSize} onChange={onPageSizeChange} />
    {showPagination && (
      <div className="flex items-center">
        <GamePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    )}
  </div>
);

export default GameListControls;

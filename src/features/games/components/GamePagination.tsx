import React from "react";
import type { GamePaginationProps } from "../types/game";

const GamePagination: React.FC<GamePaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded bg-purple-700 text-white disabled:bg-gray-400"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span className="text-white font-semibold">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-3 py-1 rounded bg-purple-700 text-white disabled:bg-gray-400"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default GamePagination;

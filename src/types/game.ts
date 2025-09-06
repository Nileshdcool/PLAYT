export interface Game {
  id: string;
  title: string;
  genre: string;
  platform: string;
  releaseDate: string;
  developer: string;
  price: number;
  metascore: number;
  multiplayer: boolean;
}

export interface GameListProps {
  games: Game[];
  isLoading: boolean;
  error: any;
}

export interface GamePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface GameSearchProps {
  value: string;
  onChange: (value: string) => void;
}

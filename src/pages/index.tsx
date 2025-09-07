
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import GrafanaEmbed from "../components/GrafanaEmbed";
import GamePagination from "../features/games/components/GamePagination";
import GameListHeader from "../features/games/components/GameListHeader";
import GameList from "../features/games/components/GameList";
import GameSearch from "../features/games/components/GameSearch";
import AddGameModal from "../features/games/components/AddGameModal";
import ReleaseYearStatsView from "../features/games/components/ReleaseYearStatsView";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'allGames' | 'yearStats' | 'logs'>('allGames');
  const [sortColumn, setSortColumn] = useState('releaseDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const utils = api.useUtils();
  const { data, isLoading, error } = api.game.list.useQuery({
    page,
    limit: pageSize,
    search: search || undefined,
    sortColumn,
    sortOrder,
  });
  const addGameMutation = api.game.add.useMutation({
    onSuccess: () => {
      utils.game.list.invalidate();
      setIsModalOpen(false);
      toast.success("Game added successfully!");
    },
    onError: (error: any) => {
      toast.error(`Error adding game: ${error.message}`);
    },
  });
  const handleAddGame = (game: any) => {
    addGameMutation.mutate(game);
  };
  const games = (data?.games ?? []).map((game: any) => ({
    ...game,
    releaseDate:
      typeof game.releaseDate === "string"
        ? game.releaseDate
        : game.releaseDate?.toISOString?.() ?? ""
  }));
  const showPagination = !search;
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "unauthenticated") {
    return null;
  }
  return (
    <>
      <Head>
        <title>Game Dashboard</title>
        <meta name="description" content="Game list and stats app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow"
            >
              Logout
            </button>
          </div>
          <div className="flex justify-center w-full border-b border-gray-600">
            <button
              className={`px-6 py-3 text-lg font-medium transition-colors duration-300 ${activeTab === 'allGames' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('allGames')}
            >All Games</button>
            <button
              className={`px-6 py-3 text-lg font-medium transition-colors duration-300 ${activeTab === 'yearStats' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('yearStats')}
            >Release Year Stats</button>
            <button
              className={`px-6 py-3 text-lg font-medium transition-colors duration-300 ${activeTab === 'logs' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('logs')}
            >Logs</button>
          </div>

          <div className="w-full max-w-4xl">
            {activeTab === 'allGames' && (
              <>
                <GameListHeader
                  onAddGame={() => setIsModalOpen(true)}
                  sortColumn={sortColumn}
                  sortOrder={sortOrder}
                  onSortColumnChange={setSortColumn}
                  onSortOrderChange={setSortOrder}
                />
                <GameSearch value={search} onChange={setSearch} />
                <GameList
                  games={games}
                  isLoading={isLoading}
                  error={error}
                />
                <div className="flex flex-row items-center justify-between w-full mt-8 px-4 py-3 bg-white/10 rounded-lg shadow">
                  <div className="flex items-center gap-2">
                    <label className="font-medium mr-2">Page Size:</label>
                    <select
                      className="rounded p-2 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={pageSize}
                      onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    >
                      {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  {showPagination && (
                    <div className="flex items-center">
                      <GamePagination
                        page={data?.page ?? 1}
                        totalPages={data?.totalPages ?? 1}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            {activeTab === 'yearStats' && <ReleaseYearStatsView />}
            {activeTab === 'logs' && (
              <GrafanaEmbed
                dashboardUrl="http://localhost:3001/explore?orgId=1&left=%7B%22datasource%22%3A%22Loki%22%2C%22expr%22%3A%22%7Bjob%3D%5C%22app%5C%22%7D%22%7D"
                width="100%"
                height="800px"
              />
            )}
          </div>
        </div>
        <AddGameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddGame={handleAddGame}
        />
      </main>
    </>
  );
}

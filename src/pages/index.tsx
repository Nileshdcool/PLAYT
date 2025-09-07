
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import GrafanaEmbed from "../components/GrafanaEmbed";
import GameListControls from "../features/games/components/GameListControls";
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
  const {
    data: listResult,
    isLoading,
    error: listError
  } = api.game.list.useQuery({
    page,
    limit: pageSize,
    search: search || undefined,
    sortColumn,
    sortOrder,
  });
  const addGameMutation = api.game.add.useMutation({
    onSuccess: (result) => {
      if (result?.success) {
        utils.game.list.invalidate();
        setIsModalOpen(false);
        toast.success("Game added successfully!");
      } else {
        toast.error("Error adding game");
      }
    },
    onError: (error: any) => {
      toast.error(`Error adding game: ${error.message}`);
    },
  });
  const handleAddGame = (game: any) => {
    addGameMutation.mutate(game);
  };
  const games = (listResult?.success && listResult.data?.games ? listResult.data.games : []).map((game: any) => ({
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
        <title>PLAYTASTIC</title>
        <meta name="description" content="PLAYTASTIC - Game list and stats app" />
        <link rel="icon" href="/playtastic-logo.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {/* Header */}
        <header className="w-full max-w-4xl mx-auto flex items-center justify-between py-4 px-6 bg-[#1a1740] rounded-b-lg shadow-lg mb-2">
          <div className="flex items-center gap-3">
            <img src="/playtastic-logo.svg" alt="PLAYTASTIC Logo" className="h-10 w-10" />
            <h1 className="text-3xl font-extrabold tracking-tight text-white">PLAYTASTIC</h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded shadow"
          >
            Logout
          </button>
        </header>
        {/* Tabs */}
        <nav className="w-full max-w-4xl mx-auto flex justify-center border-b border-gray-700 mb-4">
          <button
            className={`px-4 py-2 text-base font-medium transition-colors duration-300 ${activeTab === 'allGames' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('allGames')}
          >All Games</button>
          <button
            className={`px-4 py-2 text-base font-medium transition-colors duration-300 ${activeTab === 'yearStats' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('yearStats')}
          >Release Year Stats</button>
          <button
            className={`px-4 py-2 text-base font-medium transition-colors duration-300 ${activeTab === 'logs' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('logs')}
          >Logs</button>
        </nav>
        {/* Main Content */}
        <section className="w-full max-w-4xl mx-auto bg-[#211a3a] rounded-lg shadow p-6 flex flex-col gap-6">
          {activeTab === 'allGames' && (
            <>
              <GameListHeader
                onAddGame={() => setIsModalOpen(true)}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSortColumnChange={setSortColumn}
                onSortOrderChange={setSortOrder}
              />
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <GameSearch value={search} onChange={setSearch} />
              </div>
              <GameList
                games={games}
                isLoading={isLoading}
                error={listError}
              />
              <GameListControls
                pageSize={pageSize}
                onPageSizeChange={(size: number) => { setPageSize(size); setPage(1); }}
                showPagination={showPagination}
                page={listResult?.success && listResult.data?.page ? listResult.data.page : 1}
                totalPages={listResult?.success && listResult.data?.totalPages ? listResult.data.totalPages : 1}
                onPageChange={setPage}
              />
            </>
          )}
          {activeTab === 'yearStats' && <ReleaseYearStatsView />}
          {activeTab === 'logs' && (
            <GrafanaEmbed
              dashboardUrl="http://localhost:3001/explore?orgId=1&left=%7B%22datasource%22%3A%22Loki%22%2C%22expr%22%3A%22%7Bjob%3D%5C%22app%5C%22%7D%22%7D"
              width="100%"
              height="600px"
            />
          )}
        </section>
        <AddGameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddGame={handleAddGame}
        />
      </main>
    </>
  );
}

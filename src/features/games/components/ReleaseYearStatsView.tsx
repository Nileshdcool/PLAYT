import React, { useState } from 'react';
import { api } from '~/utils/api';
// No skipToken import needed for this tRPC version


const ReleaseYearStatsView = () => {
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 5);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [drillPage, setDrillPage] = useState(1);
  const [drillPageSize, setDrillPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('genre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, error } = api.game.releaseYearStats.useQuery(
    { startYear, endYear, sortColumn, sortOrder }
  );

  // Drill-down query for games by genre and period
  const drillQuery = api.game.listGamesByGenreAndPeriod.useQuery(
    {
      genre: expandedGenre ?? '',
      startYear,
      endYear,
      page: drillPage,
      limit: drillPageSize,
    },
    { enabled: !!expandedGenre }
  );

  const handleFetchStats = () => {
    setExpandedGenre(null);
    // No need to call refetch; query will auto-update
  };

  const handleRowClick = (genre: string) => {
    if (expandedGenre === genre) {
      setExpandedGenre(null);
    } else {
      setExpandedGenre(genre);
      setDrillPage(1);
    }
  };

  return (
    <div className="p-6 bg-white/10 rounded-lg shadow-lg text-white">
  <h2 className="text-2xl font-bold mb-4">Release Year Statistics</h2>

      <div className="flex items-center gap-4 mb-6">
        <div>
          <label htmlFor="startYear" className="block text-sm font-medium mb-1">Start Year</label>
          <input
            id="startYear"
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label htmlFor="endYear" className="block text-sm font-medium mb-1">End Year</label>
          <input
            id="endYear"
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleFetchStats}
          className="self-end px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold transition-colors"
        >
          Fetch Stats
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {data && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                {[
                  { key: 'genre', label: 'Genre' },
                  { key: 'count', label: 'Game Count' },
                  { key: 'avgPrice', label: 'Avg. Price' },
                  { key: 'highestMetascore', label: 'Highest Metascore' },
                  { key: 'lowestMetascore', label: 'Lowest Metascore' },
                ].map(col => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => {
                      if (sortColumn === col.key) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortColumn(col.key);
                        setSortOrder('asc');
                      }
                      handleFetchStats();
                    }}
                  >
                    {col.label}
                    {sortColumn === col.key && (
                      <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {data.map((stat) => (
                <React.Fragment key={stat.genre}>
                  <tr
                    className="cursor-pointer hover:bg-purple-900/30"
                    onClick={() => handleRowClick(stat.genre)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{stat.genre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stat.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${stat.avgPrice?.toFixed(2) ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stat.highestMetascore ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stat.lowestMetascore ?? 'N/A'}</td>
                  </tr>
                  {expandedGenre === stat.genre && (
                    <tr>
                      <td colSpan={5} className="bg-gray-800 px-6 py-4">
                        {drillQuery.isLoading && <p>Loading games...</p>}
                        {drillQuery.error && <p className="text-red-400">Error: {drillQuery.error.message}</p>}
                        {drillQuery.data && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Games in {stat.genre} ({startYear}-{endYear})</h3>
                            <table className="min-w-full mb-2">
                              <thead>
                                <tr>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Title</th>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Platform</th>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Release Date</th>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Developer</th>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Price</th>
                                  <th className="px-2 py-1 text-left text-xs font-medium uppercase">Metascore</th>
                                </tr>
                              </thead>
                              <tbody>
                                {drillQuery.data.games.map((game: any) => (
                                  <tr key={game.id}>
                                    <td className="px-2 py-1 whitespace-nowrap">{game.title}</td>
                                    <td className="px-2 py-1 whitespace-nowrap">{game.platform}</td>
                                    <td className="px-2 py-1 whitespace-nowrap">{typeof game.releaseDate === 'string' ? game.releaseDate : new Date(game.releaseDate).toLocaleDateString()}</td>
                                    <td className="px-2 py-1 whitespace-nowrap">{game.developer}</td>
                                    <td className="px-2 py-1 whitespace-nowrap">${game.price?.toFixed(2)}</td>
                                    <td className="px-2 py-1 whitespace-nowrap">{game.metascore}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="flex items-center justify-between mt-2">
                              <span>Page {drillQuery.data.page} of {drillQuery.data.totalPages}</span>
                              <div>
                                <button
                                  className="px-2 py-1 mr-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
                                  disabled={drillQuery.data.page === 1}
                                  onClick={() => setDrillPage(drillQuery.data.page - 1)}
                                >
                                  Prev
                                </button>
                                <button
                                  className="px-2 py-1 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
                                  disabled={drillQuery.data.page === drillQuery.data.totalPages}
                                  onClick={() => setDrillPage(drillQuery.data.page + 1)}
                                >
                                  Next
                                </button>
                                <select
                                  className="ml-4 p-1 rounded bg-gray-700 text-white border border-gray-500"
                                  value={drillPageSize}
                                  onChange={e => { setDrillPageSize(Number(e.target.value)); setDrillPage(1); }}
                                >
                                  {[5, 10, 20, 50].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReleaseYearStatsView;

interface Game {
  id: string;
  createdAt: Date | string;
  winner: {
    id: string;
    name: string;
  } | null;
  players?: {
    player: {
      id: string;
      name: string;
    };
  }[];
}

interface GameTimelineProps {
  games: Game[];
}

export default function GameTimeline({ games }: GameTimelineProps) {
  // Sort games by creation date (newest first)
  const sortedGames = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (games.length === 0) {
    return (
      <div className="card-1">
        <h2 className="text-xl font-semibold mb-4">Game Timeline</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600">No games played yet</p>
          <p className="text-sm text-gray-500 mt-1">Games will appear here once they are recorded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-1">
      <h2 className="text-xl font-semibold mb-4">Game Timeline ({games.length})</h2>
      <div className="space-y-4">
        {sortedGames.map((game, index) => {
          const playerNames = game.players?.map((gp) => gp.player.name) || [];
          const gameDate = typeof game.createdAt === "string" ? new Date(game.createdAt) : game.createdAt;

          return (
            <div key={game.id} className="relative">
              {/* Timeline line */}
              {index < sortedGames.length - 1 && (
                <div className="absolute left-3 top-8 bottom-[-10px] w-0.5 bg-gray-200" />
              )}

              <div className="flex items-start gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                {/* Game content */}
                <div className="flex-1 min-w-0">
                  <div className="card-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-success">
                          🏆 {game.winner?.name || "No winner recorded"}
                        </span>
                        <span className="badge badge-sm">Game #{sortedGames.length - index}</span>
                      </div>
                      <time className="text-sm text-gray-500">
                        {gameDate.toLocaleDateString()} at{" "}
                        {gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </div>

                    <div className="text-sm text-gray-600">
                      <strong>Players:</strong> {playerNames.join(", ")}
                    </div>

                    {/* VP and Points awarded */}
                    <div className="mt-2 space-y-1">
                      {game.winner && (
                        <div className="text-xs text-primary">{game.winner.name}: +2 VP, +20pts</div>
                      )}
                      {game.players && game.players.length > 0 && (
                        <div className="text-xs text-warning">
                          {game.players
                            .filter((gp) => gp.player.id !== game.winner?.id)
                            .map((gp) => `${gp.player.name}: +40pts`)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

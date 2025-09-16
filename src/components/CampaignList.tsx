import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  createdAt: Date | string;
  players: {
    id: string;
    name: string;
    listUrl: string;
  }[];
  isOwner: boolean;
}

interface CampaignListProps {
  title: string;
  campaigns: Campaign[];
  emptyMessage: string;
}

export default function CampaignList({ title, campaigns, emptyMessage }: CampaignListProps) {
  return (
    <div className="card-1">
      <h2 className="text-xl font-semibold mb-4">
        {title} ({campaigns.length})
      </h2>
      {campaigns.length === 0 ? (
        <p className="text-gray-600">{emptyMessage}</p>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="card-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{campaign.name}</h3>
                  </div>
                  <div className="flex gap-4 items-center">
                    <p className="text-sm mt-1">
                      {campaign.players.length} player{campaign.players.length !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Created: {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link href={`/campaigns/${campaign.id}`} className="btn btn-info btn-sm">
                  View Details
                </Link>
              </div>

              {campaign.players.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-muted mb-2">Players:</h4>
                  <div className="space-y-2">
                    {campaign.players.map((player) => (
                      <div key={player.id} className="text-sm flex justify-between">
                        <span>{player.name}</span>
                        <a
                          href={player.listUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-accent btn-xs hover:underline"
                        >
                          View List
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

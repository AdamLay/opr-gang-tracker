import CreatePlayerForm from "@/components/CreatePlayerForm";
import InviteLinkSection from "@/components/InviteLinkSection";
import GameTimeline from "@/components/GameTimeline";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignAction } from "../actions";
import AddGameDialog from "@/components/AddGameDialog";
import { DeleteCampaignButton } from "@/components/DeleteCampaignButton";

interface CampaignPageProps {
  params: { id: string };
}
export default async function CampaignPage({ params }: CampaignPageProps) {
  const { id } = await params;
  const result = await getCampaignAction(id);

  if (!result.success) {
    if (result.error === "Campaign not found") {
      notFound();
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">Error loading campaign: {result.error}</div>
        <Link href="/campaigns" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Campaigns
        </Link>
      </div>
    );
  }

  const campaign = result.data!;
  const isOwner = result.isOwner!;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* <Link href="/campaigns" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Campaigns
          </Link> */}
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-600">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
            {!isOwner && <span className="badge badge-info">Member</span>}
          </div>
        </div>
        <div className="flex gap-4">
          {/* Show delete button only for owners */}
          {isOwner && <DeleteCampaignButton campaign={campaign} />}
          <AddGameDialog campaignId={campaign.id} players={campaign.players} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div>
            {/* <h2 className="text-xl font-semibold mb-4">Players ({campaign.players.length})</h2> */}
            {campaign.players.length === 0 ? (
              <p className="text-gray-600">No players yet. Add the first player!</p>
            ) : (
              <div className="space-y-3">
                {campaign.players.map((player) => {
                  // Calculate VP: 2VP for each game won
                  const gamesWon = campaign.games
                    ? campaign.games.filter((game: any) => game.winnerId === player.id).length
                    : 0;
                  const vp = gamesWon * 2;

                  // Calculate Points: 20pts for wins, 40pts for losses
                  const gamesPlayed = campaign.games
                    ? campaign.games.filter((game: any) =>
                        game.players?.some((gp: any) => gp.player.id === player.id)
                      ).length
                    : 0;
                  const gamesLost = gamesPlayed - gamesWon;
                  const points = gamesWon * 20 + gamesLost * 40;

                  return (
                    <div key={player.id} className="card-1">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium">{player.name}</h3>
                          {/* <p className="text-sm text-gray-600 mt-1">
                            Added: {new Date(player.createdAt).toLocaleDateString()}
                          </p> */}
                          <div className="flex gap-4 mt-1">
                            <p className="text-sm text-success">Total VP: {vp}</p>
                            <p className="text-sm text-warning">Points: {points}</p>
                          </div>
                        </div>
                        <a
                          href={player.listUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-info btn-sm"
                        >
                          View List
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <InviteLinkSection inviteToken={campaign.inviteToken} />
          {isOwner && (
            <div className="card-1 flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Add New Player</h2>
              <CreatePlayerForm campaignId={campaign.id} />
            </div>
          )}
        </div>

        <GameTimeline games={campaign.games} />
      </div>
    </div>
  );
}

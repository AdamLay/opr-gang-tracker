import CreatePlayerForm from "@/components/CreatePlayerForm";
import InviteLinkSection from "@/components/InviteLinkSection";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCampaignAndRedirectAction, getCampaignAction, createGameAction } from "../actions";
import AddGameDialog from "@/components/AddGameDialog";

interface CampaignPageProps {
  params: { id: string };
}
export default async function CampaignPage({ params }: CampaignPageProps) {
  const result = await getCampaignAction(params.id);

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

  // Add Game Dialog State (client component)
  // DaisyUI modal/dialog pattern
  // This is a hybrid approach: the dialog and form are rendered client-side
  // The server action is called via a form action

  async function deleteCampaign(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteCampaignAndRedirectAction(id);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AddGameDialog campaignId={campaign.id} players={campaign.players} />

      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/campaigns" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-gray-600 mt-2">Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
        </div>
        <form action={deleteCampaign}>
          <input type="hidden" name="id" value={campaign.id} />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete Campaign
          </button>
        </form>
      </div>

      <InviteLinkSection inviteToken={campaign.inviteToken} />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
          <CreatePlayerForm campaignId={campaign.id} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Players ({campaign.players.length})</h2>
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
                return (
                  <div key={player.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{player.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Added: {new Date(player.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-success mt-1">Total VP: {vp}</p>
                      </div>
                      <a
                        href={player.listUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
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
      </div>
    </div>
  );
}

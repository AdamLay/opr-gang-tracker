import CreateCampaignForm from "@/components/CreateCampaignForm";
import Link from "next/link";
import { getCampaignsAction } from "./actions";

export default async function CampaignsPage() {
  const result = await getCampaignsAction();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
        <div className="text-red-600 mb-6">Error loading campaigns: {result.error}</div>
        <CreateCampaignForm />
      </div>
    );
  }

  const campaigns = result.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gang War Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
          <CreateCampaignForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Campaigns</h2>
          {campaigns.length === 0 ? (
            <p className="text-gray-600">No campaigns yet. Create your first one above!</p>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {campaign.players.length} player{campaign.players.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>

                  {campaign.players.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Players:</h4>
                      <div className="space-y-1">
                        {campaign.players.map((player) => (
                          <div key={player.id} className="text-sm text-gray-600 flex justify-between">
                            <span>{player.name}</span>
                            <a
                              href={player.listUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
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
      </div>
    </div>
  );
}

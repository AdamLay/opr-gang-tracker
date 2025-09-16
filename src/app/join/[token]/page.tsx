import { notFound } from "next/navigation";
import { getCampaignByInviteToken } from "@/lib/database";
import { joinCampaignAction } from "../actions";

interface JoinPageProps {
  params: { token: string };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const campaign = await getCampaignByInviteToken(params.token);

  if (!campaign) {
    notFound();
  }

  async function joinCampaign(formData: FormData) {
    "use server";
    await joinCampaignAction(params.token, formData);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">Join Campaign</h1>
          <p className="text-lg font-semibold mb-2">{campaign.name}</p>
          <p className="text-sm text-gray-600 mb-6">
            {campaign.players.length} player{campaign.players.length !== 1 ? "s" : ""} already joined
          </p>

          <form action={joinCampaign} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="input input-bordered w-full"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Army List URL</span>
              </label>
              <input
                type="url"
                name="listUrl"
                required
                className="input input-bordered w-full"
                placeholder="https://..."
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Join Campaign
            </button>
          </form>

          {campaign.players.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Current Players:</h3>
              <div className="space-y-1">
                {campaign.players.map((player) => (
                  <div key={player.id} className="text-sm text-gray-600">
                    {player.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

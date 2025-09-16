import { notFound, redirect } from "next/navigation";
import { getCampaignByInviteToken } from "@/lib/database";
import { createClient } from "@/lib/supabase/server";
import { joinCampaignAction } from "../actions";
import Link from "next/link";

interface JoinPageProps {
  params: { token: string };
}

export default async function JoinPage({ params }: JoinPageProps) {
  // Check authentication first
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login with return URL
  if (error || !user) {
    redirect(`/auth/login?returnUrl=${encodeURIComponent(`/join/${params.token}`)}`);
  }

  const campaign = await getCampaignByInviteToken(params.token);

  if (!campaign) {
    notFound();
  }

  // Check if user is already in this campaign
  const isAlreadyMember = campaign.players.some((player) => player.userId === user.id);

  async function joinCampaign(formData: FormData) {
    "use server";
    await joinCampaignAction(params.token, formData);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="card-1">
        <h1 className="card-title text-2xl mb-4">Join Campaign</h1>
        <p className="text-lg font-semibold mb-2">{campaign.name}</p>
        <p className="text-sm text-gray-600 mb-2">Signed in as: {user.email}</p>

        {isAlreadyMember ? (
          <div className="alert alert-info mb-4">
            <span>You're already a member of this campaign!</span>
            <Link href="/campaigns" className="btn btn-sm btn-outline">
              View
            </Link>
          </div>
        ) : (
          <form action={joinCampaign} className="space-y-4">
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                name="name"
                required
                className="input w-full"
                placeholder="Enter your name"
              />
            </div>

            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text">Army List URL</span>
              </label>
              <input type="url" name="listUrl" required className="input w-full" placeholder="https://..." />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Join Campaign
            </button>
          </form>
        )}

        {campaign.players.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">{campaign.players.length} players already joined:</h3>
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
  );
}

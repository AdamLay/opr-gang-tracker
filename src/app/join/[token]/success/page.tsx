import Link from "next/link";
import { getCampaignByInviteToken } from "@/lib/database";
import { notFound } from "next/navigation";

interface JoinSuccessPageProps {
  params: { token: string };
}

export default async function JoinSuccessPage({ params }: JoinSuccessPageProps) {
  const campaign = await getCampaignByInviteToken(params.token);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="card-title text-2xl mb-4 justify-center">Welcome!</h1>
          <p className="text-lg mb-4">You've successfully joined the campaign!</p>
          <p className="text-lg font-semibold mb-6">{campaign.name}</p>
          <p className="text-sm text-gray-600 mb-6">
            The campaign owner will be able to see you in their player list and add you to games.
          </p>

          <div className="flex flex-col gap-3">
            <Link href={`/campaigns/${campaign.id}`} className="btn btn-primary">
              View Campaign
            </Link>
            <Link href="/campaigns" className="btn btn-outline">
              View All My Campaigns
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

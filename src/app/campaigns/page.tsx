import CreateCampaignForm from "@/components/CreateCampaignForm";
import CampaignList from "@/components/CampaignList";
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

  const allCampaigns = result.data || [];
  const ownedCampaigns = allCampaigns.filter((campaign) => campaign.isOwner);
  const memberCampaigns = allCampaigns.filter((campaign) => !campaign.isOwner);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
        <div className="space-y-8">
          {/* Owned Campaigns */}
          <CampaignList
            title="My Campaigns"
            campaigns={ownedCampaigns}
            emptyMessage="No campaigns created yet. Create your first one!"
          />

          {/* Member Campaigns */}
          {memberCampaigns.length > 0 && (
            <CampaignList title="Member Of" campaigns={memberCampaigns} emptyMessage="" />
          )}
        </div>

        <div className="card-1">
          <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
          <CreateCampaignForm />
        </div>
      </div>
    </div>
  );
}

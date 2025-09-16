"use client";

import { deleteCampaignAndRedirectAction } from "@/app/campaigns/actions";

export function DeleteCampaignButton({ campaign }: { campaign: { id: string; name: string } }) {
  async function deleteCampaign(formData: FormData) {
    const id = formData.get("id") as string;
    await deleteCampaignAndRedirectAction(id);
  }
  return (
    <form action={deleteCampaign}>
      <input type="hidden" name="id" value={campaign.id} />
      <button
        type="submit"
        className="btn btn-error"
        onClick={(e) => {
          if (
            !confirm(
              `Are you sure you want to delete "${campaign.name}"? This action cannot be undone and will remove all players and games.`
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        Delete Campaign
      </button>
    </form>
  );
}

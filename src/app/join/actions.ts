"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { joinCampaignWithToken, getCampaignByInviteToken } from "@/lib/database";

export async function joinCampaignAction(token: string, formData: FormData) {
  const name = formData.get("name") as string;
  const listUrl = formData.get("listUrl") as string;

  if (!name || !listUrl) {
    throw new Error("Name and list URL are required");
  }

  try {
    const campaign = await getCampaignByInviteToken(token);
    if (!campaign) {
      throw new Error("Invalid invite link");
    }

    await joinCampaignWithToken(token, { name, listUrl });
    revalidatePath(`/campaigns/${campaign.id}`);
    redirect(`/join/${token}/success`);
  } catch (error) {
    console.error("Error joining campaign:", error);
    throw new Error("Failed to join campaign");
  }
}

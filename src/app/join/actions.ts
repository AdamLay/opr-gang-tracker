"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { joinCampaignWithToken, getCampaignByInviteToken } from "@/lib/database";
import { createClient } from "@/lib/supabase/server";

export async function joinCampaignAction(token: string, formData: FormData) {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const name = formData.get("name") as string;
  const listUrl = formData.get("listUrl") as string;

  if (!name || !listUrl) {
    throw new Error("Name and list URL are required");
  }

  let campaignId = null;
  try {
    const campaign = await getCampaignByInviteToken(token);
    if (!campaign) {
      throw new Error("Invalid invite link");
    }
    campaignId = campaign.id;

    // Check if user is already in this campaign
    const isAlreadyMember = campaign.players.some((player) => player.userId === user.id);
    if (isAlreadyMember) {
      throw new Error("You are already a member of this campaign");
    }

    await joinCampaignWithToken(token, { name, listUrl, userId: user.id });
  } catch (error) {
    console.error("Error joining campaign:", error);
    throw new Error("Failed to join campaign");
  }

  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/join/${token}/success`);
}

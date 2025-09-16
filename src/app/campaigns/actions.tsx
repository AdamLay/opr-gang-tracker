"use server";

import { createGame as dbCreateGame } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createCampaign as dbCreateCampaign,
  getAllCampaigns as dbGetAllCampaigns,
  getCampaign as dbGetCampaign,
  getCampaignWithAccess as dbGetCampaignWithAccess,
  updateCampaign as dbUpdateCampaign,
  deleteCampaign as dbDeleteCampaign,
} from "@/lib/database";
import { CreateCampaignData, UpdateCampaignData } from "@/types/database";

export async function createGameAction({
  campaignId,
  playerIds,
  winnerId,
}: {
  campaignId: string;
  playerIds: string[];
  winnerId: string;
}) {
  try {
    // Optionally, check user authentication here
    const game = await dbCreateGame({ campaignId, playerIds, winnerId });
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: game };
  } catch (error) {
    console.error("Error creating game:", error);
    return { success: false, error: "Failed to create game" };
  }
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return user;
}

export async function createCampaignAction(data: CreateCampaignData) {
  try {
    const user = await getAuthenticatedUser();
    const campaign = await dbCreateCampaign({ ...data, userId: user.id });
    revalidatePath("/campaigns");
    return { success: true, data: campaign };
  } catch (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: "Failed to create campaign" };
  }
}

export async function getCampaignsAction() {
  try {
    const user = await getAuthenticatedUser();
    const campaigns = await dbGetAllCampaigns(user.id);
    return { success: true, data: campaigns };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaignAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const campaign = await dbGetCampaignWithAccess(id, user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found" };
    }

    // Determine if user is the owner
    const isOwner = campaign.userId === user.id;

    return {
      success: true,
      data: campaign,
      isOwner,
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return { success: false, error: "Failed to fetch campaign" };
  }
}

export async function updateCampaignAction(id: string, data: UpdateCampaignData) {
  try {
    const user = await getAuthenticatedUser();
    const campaign = await dbUpdateCampaign(id, user.id, data);
    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${id}`);
    return { success: true, data: campaign };
  } catch (error) {
    console.error("Error updating campaign:", error);
    return { success: false, error: "Failed to update campaign" };
  }
}

export async function deleteCampaignAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    await dbDeleteCampaign(id, user.id);
    revalidatePath("/campaigns");
    return { success: true };
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return { success: false, error: "Failed to delete campaign" };
  }
}

export async function deleteCampaignAndRedirectAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    await dbDeleteCampaign(id, user.id);
    revalidatePath("/campaigns");
  } catch (error) {
    console.error("Error deleting campaign:", error);
    throw new Error("Failed to delete campaign");
  }
  redirect("/campaigns");
}

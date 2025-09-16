"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  createPlayer as dbCreatePlayer,
  getPlayer as dbGetPlayer,
  getPlayersByCampaign as dbGetPlayersByCampaign,
  updatePlayer as dbUpdatePlayer,
  deletePlayer as dbDeletePlayer,
  getCampaign as dbGetCampaign,
} from "@/lib/database";
import { CreatePlayerData, UpdatePlayerData } from "@/types/database";

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

export async function createPlayerAction(data: CreatePlayerData) {
  try {
    const user = await getAuthenticatedUser();

    // Verify that the campaign belongs to the user
    const campaign = await dbGetCampaign(data.campaignId, user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found or access denied" };
    }

    const player = await dbCreatePlayer({ ...data, userId: user.id });
    revalidatePath("/campaigns");
    revalidatePath(`/campaigns/${data.campaignId}`);
    return { success: true, data: player };
  } catch (error) {
    console.error("Error creating player:", error);
    return { success: false, error: "Failed to create player" };
  }
}

export async function getPlayerAction(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const player = await dbGetPlayer(id, user.id);
    if (!player) {
      return { success: false, error: "Player not found" };
    }
    return { success: true, data: player };
  } catch (error) {
    console.error("Error fetching player:", error);
    return { success: false, error: "Failed to fetch player" };
  }
}

export async function getPlayersByCampaignAction(campaignId: string) {
  try {
    const user = await getAuthenticatedUser();

    // Verify that the campaign belongs to the user
    const campaign = await dbGetCampaign(campaignId, user.id);
    if (!campaign) {
      return { success: false, error: "Campaign not found or access denied" };
    }

    const players = await dbGetPlayersByCampaign(campaignId, user.id);
    return { success: true, data: players };
  } catch (error) {
    console.error("Error fetching players:", error);
    return { success: false, error: "Failed to fetch players" };
  }
}

export async function updatePlayerAction(id: string, data: UpdatePlayerData) {
  try {
    const user = await getAuthenticatedUser();
    const updatedPlayer = await dbUpdatePlayer(id, user.id, data);

    // Get the updated player to find the campaign ID for revalidation
    const playerWithCampaign = await dbGetPlayer(id, user.id);
    if (playerWithCampaign) {
      revalidatePath(`/campaigns/${playerWithCampaign.campaignId}`);
    }
    revalidatePath("/campaigns");
    return { success: true, data: updatedPlayer };
  } catch (error) {
    console.error("Error updating player:", error);
    return { success: false, error: "Failed to update player" };
  }
}

export async function deletePlayerAction(id: string) {
  try {
    const user = await getAuthenticatedUser();

    // Get the player to find the campaign ID for revalidation before deleting
    const player = await dbGetPlayer(id, user.id);
    if (!player) {
      return { success: false, error: "Player not found" };
    }

    await dbDeletePlayer(id, user.id);
    revalidatePath(`/campaigns/${player.campaignId}`);
    revalidatePath("/campaigns");
    return { success: true };
  } catch (error) {
    console.error("Error deleting player:", error);
    return { success: false, error: "Failed to delete player" };
  }
}

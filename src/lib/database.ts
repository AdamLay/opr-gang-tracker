// Game operations
import { CreateCampaignData, CreatePlayerData, UpdateCampaignData, UpdatePlayerData } from "@/types/database";
import { prisma } from "./prisma";
export async function createGame({
  campaignId,
  playerIds,
  winnerId,
}: {
  campaignId: string;
  playerIds: string[];
  winnerId: string;
}) {
  // Create the game
  const game = await prisma.game.create({
    data: {
      campaignId,
      winnerId,
      players: {
        create: playerIds.map((playerId) => ({ playerId })),
      },
    },
    include: {
      winner: true,
      players: { include: { player: true } },
    },
  });
  return game;
}

// Campaign operations
export async function createCampaign(data: CreateCampaignData & { userId: string }) {
  return await prisma.campaign.create({
    data,
    include: {
      players: true,
    },
  });
}

export async function getCampaign(id: string, userId: string) {
  return await prisma.campaign.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      players: true,
      games: {
        include: {
          winner: true,
          players: { include: { player: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

// Get campaign with player access (readonly for non-owners)
export async function getCampaignWithAccess(id: string, userId: string) {
  return await prisma.campaign.findFirst({
    where: {
      OR: [
        { id: id, userId: userId }, // Owner access
        {
          id: id,
          players: {
            some: { userId: userId },
          },
        }, // Player access
      ],
    },
    include: {
      players: true,
      games: {
        include: {
          winner: true,
          players: { include: { player: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

// Get campaign by invite token (public access)
export async function getCampaignByInviteToken(inviteToken: string) {
  return await prisma.campaign.findUnique({
    where: {
      inviteToken: inviteToken,
    },
    include: {
      players: true,
    },
  });
}

// Join campaign with invite token (no userId required)
export async function joinCampaignWithToken(
  inviteToken: string,
  playerData: { name: string; listUrl: string; userId: string }
) {
  const campaign = await getCampaignByInviteToken(inviteToken);
  if (!campaign) {
    throw new Error("Invalid invite link");
  }

  return await prisma.player.create({
    data: {
      name: playerData.name,
      listUrl: playerData.listUrl,
      campaignId: campaign.id,
      userId: playerData.userId, // Now uses the authenticated user's ID
    },
  });
}

export async function getAllCampaigns(userId: string) {
  return await prisma.campaign.findMany({
    where: { userId: userId },
    include: {
      players: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateCampaign(id: string, userId: string, data: UpdateCampaignData) {
  // First check if the campaign belongs to the user
  const campaign = await prisma.campaign.findFirst({
    where: { id: id, userId: userId },
  });

  if (!campaign) {
    throw new Error("Campaign not found or access denied");
  }

  return await prisma.campaign.update({
    where: { id: id },
    data,
    include: {
      players: true,
    },
  });
}

export async function deleteCampaign(id: string, userId: string) {
  // First check if the campaign belongs to the user
  const campaign = await prisma.campaign.findFirst({
    where: { id: id, userId: userId },
  });

  if (!campaign) {
    throw new Error("Campaign not found or access denied");
  }

  return await prisma.campaign.delete({
    where: { id: id },
  });
}

// Player operations
export async function createPlayer(data: CreatePlayerData & { userId: string }) {
  return await prisma.player.create({
    data,
  });
}

export async function getPlayer(id: string, userId: string) {
  return await prisma.player.findFirst({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      campaign: true,
    },
  });
}

export async function getPlayersByCampaign(campaignId: string, userId: string) {
  return await prisma.player.findMany({
    where: {
      campaignId: campaignId,
      userId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function updatePlayer(id: string, userId: string, data: UpdatePlayerData) {
  // First check if the player belongs to the user
  const player = await prisma.player.findFirst({
    where: { id: id, userId: userId },
  });

  if (!player) {
    throw new Error("Player not found or access denied");
  }

  return await prisma.player.update({
    where: { id: id },
    data,
  });
}

export async function deletePlayer(id: string, userId: string) {
  // First check if the player belongs to the user
  const player = await prisma.player.findFirst({
    where: { id: id, userId: userId },
  });

  if (!player) {
    throw new Error("Player not found or access denied");
  }

  return await prisma.player.delete({
    where: { id: id },
  });
}

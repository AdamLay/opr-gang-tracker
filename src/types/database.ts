export interface Game {
  id: string;
  campaignId: string;
  winnerId?: string;
  winner?: Player;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  name: string;
  userId: string;
  players: Player[];
  games?: Game[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  listUrl: string;
  userId: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignData {
  name: string;
}

export interface CreatePlayerData {
  name: string;
  listUrl: string;
  campaignId: string;
}

export interface UpdateCampaignData {
  name?: string;
}

export interface UpdatePlayerData {
  name?: string;
  listUrl?: string;
}

import { Client } from "discord.js";

export interface ExtendedClient extends Client {
  lastAnswerId: number;
  targetChannelId: string;
  targetGuildId: string;
}

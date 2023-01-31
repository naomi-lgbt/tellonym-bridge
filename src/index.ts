import { Client, EmbedBuilder, GatewayIntentBits } from "discord.js";

import { ExtendedClient } from "./interfaces/ExtendedClient";
import { Tellonym } from "./interfaces/Tellonym";
import { logHandler } from "./utils/logHandler";

(async () => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  }) as ExtendedClient;

  if (!process.env.GUILD_ID || !process.env.CHANNEL_ID) {
    logHandler.log("error", "GUILD_ID and CHANNEL_ID must be set!");
    return;
  }

  client.on("ready", async () => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID as string);
    const channel = await guild.channels.fetch(
      process.env.CHANNEL_ID as string
    );

    if (!channel || !("send" in channel)) {
      logHandler.log("error", "Channel is not a text channel!");
      return;
    }

    const test = await channel.send("Hello world!");

    if (!test) {
      logHandler.log("error", "Failed to send message!");
      return;
    }

    logHandler.log("debug", "Fetching initial data...");
    const initialRawData = await fetch(
      `https://api.tellonym.me/profiles/name/${process.env.TELLONYM_USERNAME}?limit=25&pos=1`,
      {
        headers: {
          accept: "application/json",
          authority: "api.tellonym.me",
          method: "GET",
          "user-agent": "Naomi's Tellonym Discord Bot",
        },
      }
    );
    const initialData: Tellonym = await initialRawData.json();
    // eslint-disable-next-line require-atomic-updates
    client.lastAnswerId = initialData.answers[0].id;
    logHandler.log(
      "debug",
      `Initial data fetched. Last answer ID: ${client.lastAnswerId}`
    );

    setInterval(async () => {
      logHandler.log("debug", "Fetching data...");
      const rawData = await fetch(
        `https://api.tellonym.me/profiles/name/${process.env.TELLONYM_USERNAME}?limit=25`,
        {
          headers: {
            accept: "application/json",
            authority: "api.tellonym.me",
            method: "GET",
            "user-agent": "Naomi's Tellonym Discord Bot",
          },
        }
      );
      const data: Tellonym = await rawData.json();

      if (data.answers[0].id === client.lastAnswerId) {
        logHandler.log("debug", "No new answers.");
        return;
      }

      const answerIndex = data.answers
        .filter((ans) => ans.type === "answer")
        .findIndex((ans) => ans.id === client.lastAnswerId);
      const latestAnswers = data.answers
        .filter((ans) => ans.type === "answer")
        .slice(0, answerIndex);

      logHandler.log("debug", `New answers found: ${latestAnswers.length}`);

      for (const answer of latestAnswers) {
        const embed = new EmbedBuilder();
        embed.setTitle("New Tellonym answer!");
        embed.setDescription(answer.answer.slice(0, 4000));
        embed.addFields([
          {
            name: "Question",
            value: answer.tell.slice(0, 1000),
          },
        ]);
        embed.setURL(`https://tellonym.me/${process.env.TELLONYM_USERNAME}`);
        embed.setFooter({
          text: "Built with love by Naomi: https://donate.naomi.lgbt",
          iconURL: "https://cdn.nhcarrigan.com/profile.png",
        });

        await channel.send({ embeds: [embed] });
      }

      client.lastAnswerId = data.answers[0].id;
    }, 300000);
  });

  await client.login(process.env.TOKEN);
})();

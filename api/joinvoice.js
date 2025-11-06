import { Client, GatewayIntentBits } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed, use GET" });
  }

  const { bot_token, guild_id, channel_id } = req.query;

  if (!bot_token || !guild_id || !channel_id) {
    return res.status(400).json({ error: "bot_token, guild_id ve channel_id gerekli!" });
  }

  try {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

    await client.login(bot_token);

    client.once("ready", async () => {
      try {
        const guild = await client.guilds.fetch(guild_id);
        const channel = await guild.channels.fetch(channel_id);

        if (!channel || channel.type !== 2) { // 2 = GUILD_VOICE
          res.status(400).json({ error: "Geçerli bir ses kanalı değil!" });
          return client.destroy();
        }

        // Ses kanalına join et
        joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator
        });

        res.status(200).json({ result: "Bot ses kanalına bağlandı!" });
        client.destroy();
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ses kanalına bağlanırken hata!" });
        client.destroy();
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Bot başlatılamadı!" });
  }
}

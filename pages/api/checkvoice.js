// pages/api/voiceCheck.js
import { Client, GatewayIntentBits } from "discord.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    const { user_id, guild_id, token } = req.body;

    if (!user_id || !guild_id || !token) {
      return res.status(400).json({ error: "Eksik alanlar! user_id, guild_id ve token gerekli." });
    }

    // Discord bot client
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

    await client.login(token);

    const guild = await client.guilds.fetch(guild_id);
    if (!guild) return res.status(404).json({ error: "Guild bulunamadı." });

    const member = await guild.members.fetch(user_id).catch(() => null);
    if (!member) return res.status(404).json({ error: "Kullanıcı bulunamadı." });

    const inVoiceChannel = member.voice.channel ? true : false;

    await client.destroy();

    return res.status(200).json({
      user_id,
      guild_id,
      status: inVoiceChannel ? "SES KANALINDA" : "SES KANALINDA DEĞİLSİNİZ"
    });

  } catch (err) {
    console.error("API HATASI:", err);
    return res.status(500).json({
      error: "Sunucu hatası",
      details: err.message || err
    });
  }
}

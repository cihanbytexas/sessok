import fetch from "node-fetch";

export default async function handler(req, res) {
  // Sadece POST izinli
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { guild_id, user_id, bot_token } = req.body;

  // Eksik bilgi kontrolü
  if (!guild_id || !user_id || !bot_token) {
    return res.status(400).json({
      error: "Eksik alanlar! Gerekli: guild_id, user_id, bot_token",
    });
  }

  try {
    // Discord API'den kullanıcı bilgilerini çek
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guild_id}/members/${user_id}`,
      {
        headers: {
          Authorization: `Bot ${bot_token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        error: "Discord API hatası",
        details: data,
      });
    }

    // Kullanıcı ses kanalında mı kontrol et
    const voiceChannelId = data?.voice?.channel_id;

    if (voiceChannelId) {
      return res.status(200).json({
        durum: "✅ Kullanıcı bir ses kanalında!",
        channel_id: voiceChannelId,
      });
    } else {
      return res.status(200).json({
        durum: "❌ Kullanıcı ses kanalında değil!",
      });
    }
  } catch (err) {
    console.error("Sunucu hatası:", err);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
}

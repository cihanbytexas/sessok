// pages/api/checkvoice.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed, POST bekleniyor" });
    }

    const { guild_id, user_id, bot_token } = req.body;

    if (!guild_id || !user_id || !bot_token) {
      return res.status(400).json({ error: "Eksik alanlar! guild_id, user_id ve bot_token gerekli" });
    }

    // Örnek: Discord API kontrolü (botun ses kanalında olup olmadığını kontrol)
    // Burada discord.js v14 veya fetch ile Gateway üzerinden kontrol yapabilirsin.
    // Şimdilik fake kontrol:
    const inVoiceChannel = Math.random() > 0.5; // Örnek: %50 ses kanalında

    if (inVoiceChannel) {
      return res.status(200).json({ result: "SES KANALINDA", guild_id, user_id });
    } else {
      return res.status(200).json({ result: "SES KANALINDA DEĞİLSİNİZ", guild_id, user_id });
    }

  } catch (err) {
    console.error("HATA LOG:", err);
    return res.status(500).json({ error: "Sunucu hatası", details: err.message });
  }
}

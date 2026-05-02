const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🤖 SIMPLE AI ENGINE
async function askAI(message) {
  try {
    const res = await axios.get(
      `https://api.allorigins.win/raw?url=https://text.pollinations.ai/${encodeURIComponent(message)}`
    );

    return res.data || "Je ne comprends pas...";
  } catch (e) {
    return "Erreur IA 🌸";
  }
}

// 📌 ROUTE CHAT
router.get("/chat", async (req, res) => {
  const msg = req.query.message;

  if (!msg) {
    return res.json({ error: "Message requis" });
  }

  const reply = await askAI(msg);

  res.json({
    user: msg,
    reply
  });
});

module.exports = router;

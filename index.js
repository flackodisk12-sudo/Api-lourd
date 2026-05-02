const express = require("express");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();

const app = express();

// 🔥 PORT
const PORT = process.env.PORT || 3000;

// 🌸 MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 LOG SAFE
function log(msg) {
  console.log("🌸 [NEO API] " + msg);
}

// 🛡️ SAFE IMPORT ROUTES (évite crash si fichier manquant)
function safeRequire(routePath) {
  try {
    return require(routePath);
  } catch (err) {
    log(`❌ Route manquante : ${routePath}`);
    return express.Router();
  }
}

// 📁 ROUTES
const aiRoute = safeRequire("./routes/ai");
const toolsRoute = safeRequire("./routes/tools");
const memoryRoute = safeRequire("./routes/memory");

// 🌐 USE ROUTES
app.use("/api/ai", aiRoute);
app.use("/api/tools", toolsRoute);
app.use("/api/memory", memoryRoute);

// 🏠 HOME
app.get("/", (req, res) => {
  res.json({
    status: "NEO API ONLINE 🌸",
    creator: "Célestin Olua",
    version: "1.0.0"
  });
});

// ❤️ HEALTH CHECK (important pour hébergement)
app.get("/ping", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ❌ 404 SAFE
app.use((req, res) => {
  res.status(404).json({
    error: "Route introuvable ❌"
  });
});

// 💥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  res.status(500).json({
    error: "Erreur serveur interne"
  });
});

// 🚀 START SERVER
app.listen(PORT, () => {
  log(`Serveur lancé sur http://localhost:${PORT}`);
});

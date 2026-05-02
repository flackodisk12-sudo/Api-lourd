const express = require("express");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();

const app = express();

// 🔥 PORT & CONFIG
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const IS_PROD = ENV === "production";

// 📊 STATS
let stats = {
  requests: 0,
  errors: 0,
  startTime: Date.now()
};

// 🌸 EMOJI LOGGER AVEC STYLES
const logger = {
  info: (msg) => console.log("ℹ️  [NEO API] " + msg),
  success: (msg) => console.log("✅ [NEO API] " + msg),
  warn: (msg) => console.log("⚠️  [NEO API] " + msg),
  error: (msg) => console.log("❌ [NEO API] " + msg),
  debug: (msg) => !IS_PROD && console.log("🔧 [DEBUG] " + msg),
  http: (method, path, status) => console.log(`🌐 ${method} ${path} → ${status}`),
  naruto: () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣶⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀                           ║
║    ⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀                         ║
║    ⠀⠀⠀⣠⣿⣿⣿⠿⠛⠛⠛⠛⠿⣿⣿⣿⣿⣿⣧⠀⠀⠀                         ║
║    ⠀⠀⢰⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣧⠀⠀                        ║
║    ⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⠋⠀⠀                         ║
║    ⠀⠀⠀⠀⠹⣿⣿⣶⣶⣶⣶⣶⣶⣿⣿⣿⠟⠀⠀⠀⠀                          ║
║    ⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⠀                             ║
║                                                              ║
║         🍥 NARUTO API - "BELIEVE IT!" 🍥                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }
};

// 🌸 MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📡 HTTP LOGGER MIDDLEWARE
app.use((req, res, next) => {
  stats.requests++;
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`${req.method}`, `${req.path}`, `${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// 🛡️ SAFE IMPORT ROUTES
function safeRequire(routePath) {
  try {
    return require(routePath);
  } catch (err) {
    logger.warn(`Route manquante : ${routePath}`);
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

// 🏠 HOME - NARUTO EDITION
app.get("/", (req, res) => {
  res.json({
    status: "🍥 NEO API ONLINE 🍥",
    message: "BELIEVE IT! - Naruto's Power Flows Through This API",
    creator: "Célestin Olua",
    inspiration: "Naruto Uzumaki",
    version: "1.0.0",
    endpoints: {
      ai: "/api/ai",
      tools: "/api/tools",
      memory: "/api/memory",
      uptime: "/uptime",
      stats: "/stats",
      ping: "/ping"
    }
  });
});

// ⏱️ UPTIME
app.get("/uptime", (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  res.json({
    uptime_seconds: uptime,
    uptime_formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    message: "🍥 Naruto's jutsu is still running strong! 🍥"
  });
});

// 📊 STATS
app.get("/stats", (req, res) => {
  const uptime = Date.now() - stats.startTime;
  const memoryUsage = process.memoryUsage();

  res.json({
    requests: stats.requests,
    errors: stats.errors,
    uptime_ms: uptime,
    memory: {
      heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      external_mb: Math.round(memoryUsage.external / 1024 / 1024)
    },
    environment: ENV,
    message: "🍥 Statistics of Naruto's Power 🍥"
  });
});

// ❤️ HEALTH CHECK
app.get("/ping", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    message: "🍥 Pong! Naruto is alive! 🍥"
  });
});

// ❌ 404 SAFE
app.use((req, res) => {
  stats.errors++;
  res.status(404).json({
    error: "Route introuvable ❌",
    path: req.path,
    message: "🍥 Even Naruto can't find this path! 🍥",
    hint: "GET / pour voir les routes disponibles"
  });
});

// 💥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  stats.errors++;
  logger.error(err.message);

  res.status(500).json({
    error: "Erreur serveur interne",
    message: IS_PROD ? "Une erreur est survenue" : err.message,
    message_naruto: "🍥 Naruto's Chakra is disrupted! 🍥"
  });
});

// 🚀 START SERVER
const server = app.listen(PORT, () => {
  logger.naruto();
  logger.success(`Serveur lancé sur http://localhost:${PORT}`);
  logger.info(`Environnement: ${ENV}`);
  logger.info(`Heure: ${new Date().toLocaleString("fr-FR")}`);
  logger.success("🍥 NARUTO POWER ACTIVATED! 🍥");
});

// 🛑 GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  logger.warn("SIGTERM reçu, arrêt du serveur...");
  server.close(() => {
    logger.success("Serveur arrêté proprement");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.warn("SIGINT reçu, arrêt du serveur...");
  server.close(() => {
    logger.success("Serveur arrêté proprement");
    process.exit(0);
  });
});

module.exports = app;

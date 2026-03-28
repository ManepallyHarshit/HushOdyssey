import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import {
  getOrCreatePlayer,
  updatePlayer,
  getLeaderboard,
} from "./models/Player.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function startServer() {
  const app  = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ─── API Routes ─────────────────────────────────────────────────────────────

  /** GET /api/player/:wallet — Fetch player state */
  app.get("/api/player/:wallet", (req, res) => {
    const player = getOrCreatePlayer(req.params.wallet);
    res.json(player);
  });

  /** GET /api/leaderboard — Top 10 by score */
  app.get("/api/leaderboard", (_req, res) => {
    res.json(getLeaderboard(10));
  });

  /** POST /api/player/score — Update gems/score after level completion */
  app.post("/api/player/score", (req, res) => {
    const { walletAddress, score, gemsCollected, levelsCompleted } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

    const player = getOrCreatePlayer(walletAddress);
    const updated = updatePlayer(walletAddress, {
      score:           Math.max(player.score, score ?? 0),
      gemsCollected:   gemsCollected  ?? player.gemsCollected,
      levelsCompleted: Math.max(player.levelsCompleted, levelsCompleted ?? 0),
    });

    res.json(updated);
  });

  /** POST /api/player/mint-success — Mark the POAP as minted off-chain */
  app.post("/api/player/mint-success", (req, res) => {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "walletAddress required" });

    const updated = updatePlayer(walletAddress, { mintedGenesisPoap: true });
    res.json(updated);
  });

  // ─── Static Serving / Vite Dev Middleware ───────────────────────────────────

  if (process.env.NODE_ENV !== "production") {
    // In dev mode, proxy everything to the Vite frontend dev server
    const vite = await createViteServer({
      root:   path.join(__dirname, "../frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the compiled frontend build
    const distPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🐱 Hush Odyssey server running → http://localhost:${PORT}`);
    console.log(`   In-memory player store active (${process.env.NODE_ENV ?? "development"} mode)\n`);
  });
}

startServer();

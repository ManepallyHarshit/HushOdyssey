import express from "express";
import cors from "cors";
import {
  getOrCreatePlayer,
  updatePlayer,
  getLeaderboard,
} from "../backend/models/Player.js";

const app = express();
app.use(cors());
app.use(express.json());

// ─── API Routes (Mirrored from backend/server.js) ─────────────────────────────

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

// Export the app for Vercel
export default app;

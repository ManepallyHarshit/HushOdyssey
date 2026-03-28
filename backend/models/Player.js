/**
 * Player.js — In-memory player model (no database).
 * For a 3-level game, we store state server-side in a Map for the session.
 * Production Note: swap the `players` Map for a lightweight JSON file write
 * (fs.writeFileSync) if you need persistence across server restarts.
 */

/**
 * Creates a fresh player data object.
 * @param {string} walletAddress
 * @returns {Object}
 */
export function createPlayer(walletAddress) {
  return {
    walletAddress: walletAddress.toLowerCase(),
    score: 0,
    gemsCollected: 0,
    levelsCompleted: 0,       // Max: 3
    mintedGenesisPoap: false,
    lastActive: new Date().toISOString(),
  };
}

/**
 * In-memory store: shared across all API route handlers.
 * Key: wallet address (lowercase), Value: player object.
 * @type {Map<string, Object>}
 */
export const players = new Map();

/** Retrieve or create a player record. */
export function getOrCreatePlayer(walletAddress) {
  const addr = walletAddress.toLowerCase();
  if (!players.has(addr)) {
    players.set(addr, createPlayer(addr));
  }
  return players.get(addr);
}

/** Update mutable fields on an existing player. */
export function updatePlayer(walletAddress, updates) {
  const player = getOrCreatePlayer(walletAddress);
  Object.assign(player, updates, { lastActive: new Date().toISOString() });
  players.set(player.walletAddress, player);
  return player;
}

/** Return all players sorted by score descending (for leaderboard). */
export function getLeaderboard(limit = 10) {
  return [...players.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

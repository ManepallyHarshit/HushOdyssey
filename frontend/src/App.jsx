import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { useWallet }      from "./hooks/useWallet";
import { useMint }        from "./hooks/useMint";
import { useUnityBridge } from "./hooks/useUnityBridge";

import Header          from "./components/Header";
import GameCanvas      from "./components/GameCanvas";
import ScrollIndicator from "./components/ScrollIndicator";
import BentoHUD        from "./components/BentoHUD";
import MintOverlay     from "./components/MintOverlay";
import Footer          from "./components/Footer";

import { TOTAL_GEMS_PER_LEVEL } from "./constants";

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {

  // ── Log feed ────────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState([
    `${new Date().toLocaleTimeString([], { hour12: false })} > SYSTEM_ONLINE`,
  ]);

  const addLog = useCallback((msg) => {
    const ts = new Date().toLocaleTimeString([], { hour12: false });
    setLogs((prev) => [`${ts} > ${msg}`, ...prev].slice(0, 20));
  }, []);

  // ── Player state (local, no DB) ──────────────────────────────────────────────
  const [playerStats, setPlayerStats] = useState({
    gemsCollected:   0,
    levelsCompleted: 0,
    score:           0,
  });
  // Track previous gem count so we only award points for the DELTA each sync
  const prevGemsRef = useRef(0);

  const [leaderboard, setLeaderboard] = useState([]);

  // ── Scroll tracking ──────────────────────────────────────────────────────────
  const scrollRef        = useRef(null);
  const [activeSection, setActiveSection]       = useState("command");
  const [showScrollHint, setShowScrollHint]     = useState(true);

  const { scrollYProgress } = useScroll({ container: scrollRef });

  // Parallax: background layers move at ~30% of scroll speed
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%",  "30%"]);
  const grainY = useTransform(scrollYProgress, [0, 1], ["0%",  "15%"]);

  // Hide scroll indicator after user scrolls
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setShowScrollHint(v < 0.05);
      if (v < 0.25)       setActiveSection("command");
      else if (v < 0.75)  setActiveSection("deep-dive");
      else                setActiveSection("altar");
    });
  }, [scrollYProgress]);

  // ── Web3: Wallet ──────────────────────────────────────────────────────────────
  const { walletAddress, isConnecting, connectWallet } = useWallet(addLog);

  // ── Web3: Minting ──────────────────────────────────────────────────────────────
  const { mintPoap, isMinting, mintStatus, mintTxHash, resetMint } = useMint(addLog);

  /**
   * @param {number} [levelsCompletedSnapshot] — Pass from Unity level-complete so leaderboard
   *   sees the incremented level before React flushes setState. Omit for HUD button mint.
   */
  const handleMint = useCallback(async (levelsCompletedSnapshot) => {
    const levelsForBoard =
      typeof levelsCompletedSnapshot === "number"
        ? levelsCompletedSnapshot
        : null;

    let address = walletAddress;
    if (!address) {
      address = await connectWallet();
      if (!address) return;
    }

    await mintPoap(address);

    const addrLower = address.toLowerCase();
    const levelForBoard =
      levelsForBoard ?? playerStats.levelsCompleted;

    setLeaderboard((prev) => {
      const exists = prev.find((p) => p.walletAddress === addrLower);
      if (exists) {
        return prev.map((p) =>
          p.walletAddress === addrLower
            ? { ...p, mintedGenesisPoap: true }
            : p
        );
      }
      return [
        ...prev,
        {
          walletAddress:     addrLower,
          score:             playerStats.score,
          levelsCompleted:   levelForBoard,
          mintedGenesisPoap: true,
        },
      ].sort((a, b) => b.score - a.score);
    });
  }, [walletAddress, connectWallet, mintPoap, playerStats.score, playerStats.levelsCompleted]);

  // ── Unity Bridge (game events) ──────────────────────────────────────────────
  const onGemSync = useCallback((gems) => {
    const clampedGems = Math.max(0, Math.min(gems, TOTAL_GEMS_PER_LEVEL));
    const delta = clampedGems - prevGemsRef.current;  // Only award new gems
    if (delta <= 0) return;                            // Ignore stale/duplicate events
    prevGemsRef.current = clampedGems;
    addLog(`GEM_COLLECTED: ${clampedGems}/${TOTAL_GEMS_PER_LEVEL} [+${delta * 10}pts]`);
    setPlayerStats((prev) => ({
      ...prev,
      gemsCollected: clampedGems,
      score: prev.score + delta * 10,
    }));
  }, [addLog]);

  const onMintTrigger = useCallback((payload) => {
    // ── STRICT VALIDATION: Block premature rituals from Unity ──
    if (playerStats.gemsCollected < TOTAL_GEMS_PER_LEVEL) {
      addLog(`ALTAR_DENIED: You must collect all ${TOTAL_GEMS_PER_LEVEL} gems first (${playerStats.gemsCollected}/${TOTAL_GEMS_PER_LEVEL}).`);
      return;
    }

    const nextLevelsCompleted = Math.min(playerStats.levelsCompleted + 1, 3);

    addLog(`UNITY_SIGNAL: LEVEL_COMPLETE [${payload ?? 'altar'}] — INITIATING_RITUAL`);
    // Reset gem delta tracker for next level
    prevGemsRef.current = 0;
    setPlayerStats((prev) => ({
      ...prev,
      gemsCollected:   0,
      levelsCompleted: nextLevelsCompleted,
    }));
    // Pass snapshot so leaderboard / mint logic don't see stale levelsCompleted from this render
    handleMint(nextLevelsCompleted);
  }, [handleMint, addLog, playerStats.gemsCollected, playerStats.levelsCompleted]);

  const {
    unityProvider,
    isLoaded,
    loadingProgression,
  } = useUnityBridge({ onMintTrigger, onGemSync, addLog });

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">

      {/* ── Fixed Parallax Background Layers ─────────────────────── */}
      <motion.div
        className="fixed inset-0 nebula-bg z-0 pointer-events-none"
        style={{ y: bgY }}
      />
      <motion.div
        className="fixed inset-0 grain-overlay z-[1] pointer-events-none"
        style={{ y: grainY }}
      />

      {/* ── Fixed Navigation ──────────────────────────────────────── */}
      <Header
        walletAddress={walletAddress}
        isConnecting={isConnecting}
        onConnect={connectWallet}
        activeSection={activeSection}
      />

      {/* ── Mint Overlay Modal ────────────────────────────────────── */}
      <MintOverlay
        mintStatus={mintStatus}
        mintTxHash={mintTxHash}
        onClose={resetMint}
      />

      {/* ── Snap Scroll Container ─────────────────────────────────── */}
      <div ref={scrollRef} className="snap-container relative z-10">

        {/* ████████ SECTION 1 — COMMAND CENTER ████████████████████ */}
        <section
          id="command"
          className="snap-section-hero flex flex-col items-center justify-center pt-20 pb-4 px-6 relative"
        >
          {/* Ambient hero glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 60%, rgba(159,255,136,0.04) 0%, transparent 65%)",
            }}
          />

          {/* Tagline */}
          <motion.p
            className="text-primary/50 uppercase tracking-[0.4em] mb-4"
            style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            THE SPECTRAL CONSOLE — HUSH CHAIN
          </motion.p>

          {/* Game Canvas */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <GameCanvas
              unityProvider={unityProvider}
              isLoaded={isLoaded}
              loadingProgression={loadingProgression}
              gemsCollected={playerStats.gemsCollected}
              levelsCompleted={playerStats.levelsCompleted}
              onDevMint={() => window.triggerPoapMint?.("dev_trigger")}
            />
          </motion.div>

          {/* Animated Scroll Indicator */}
          <ScrollIndicator visible={showScrollHint} />
        </section>

        {/* ████████ SECTION 2 — DEEP DIVE (BENTO HUD) ██████████████ */}
        <BentoHUD
          playerStats={playerStats}
          leaderboard={leaderboard}
          logs={logs}
          walletAddress={walletAddress}
          isMinting={isMinting}
          mintStatus={mintStatus}
          onMintClick={() => handleMint()}
        />

        {/* ████████ SECTION 3 — TECHNICAL FOOTER ███████████████████ */}
        <Footer />

      </div>
    </div>
  );
}

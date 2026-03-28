import React from "react";
import { Unity } from "react-unity-webgl";
import { motion } from "motion/react";
import { Terminal, MemoryStick } from "lucide-react";
import { TOTAL_GEMS_PER_LEVEL } from "../constants";
import { cn } from "../lib/utils";

/**
 * GameCanvas — Renders the Unity WebGL game or a styled placeholder.
 * Shows HUD overlays, a loading progress bar, and a dev mint trigger.
 */
export default function GameCanvas({
  unityProvider,
  isLoaded,
  loadingProgression,
  gemsCollected,
  levelsCompleted,
  onDevMint,
}) {
  const gemPct = Math.round((gemsCollected / TOTAL_GEMS_PER_LEVEL) * 100);

  return (
    <div className="relative w-full max-w-5xl mx-auto group" style={{ aspectRatio: "16/9" }}>

      {/* HUD Corner Brackets */}
      <div className="hud-bracket hud-tl group-hover:scale-110 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform z-20" />
      <div className="hud-bracket hud-tr group-hover:scale-110 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform z-20" />
      <div className="hud-bracket hud-bl group-hover:scale-110 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 transition-transform z-20" />
      <div className="hud-bracket hud-br group-hover:scale-110 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform z-20" />

      {/* Main Game Area */}
      <div className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10 bg-black">

        {/* CRT Scanline overlay */}
        <div className="scanlines absolute inset-0 z-10 opacity-25 pointer-events-none" />

        {/* Unity Canvas — always rendered so it can load */}
        <Unity
          unityProvider={unityProvider}
          className="w-full h-full object-cover"
          style={{ display: isLoaded ? "block" : "none" }}
        />

        {/* Placeholder / Loading Screen */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-[5]">
            {/* Mock landscape background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: "radial-gradient(ellipse at 50% 70%, rgba(159,255,136,0.12) 0%, rgba(0,0,0,1) 70%)",
              }}
            />

            {/* Cat placeholder avatar */}
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2 border-primary/40 shadow-[0_0_30px_rgba(159,255,136,0.3)]"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                >
                  🐈
                </div>
                <div
                  className="absolute -top-3 -right-3 bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold"
                  style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
                >
                  LVL {levelsCompleted}
                </div>
              </div>

              {/* Loading bar */}
              <div className="w-64 flex flex-col items-center gap-2">
                <div className="h-0.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <motion.div
                    className="h-full progress-shimmer rounded-full"
                    animate={{ width: `${Math.max(5, loadingProgression * 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p
                  className="text-primary/60 animate-pulse tracking-widest"
                  style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
                >
                  {loadingProgression > 0
                    ? `LOADING_VIRTUAL_REALM... ${Math.round(loadingProgression * 100)}%`
                    : "AWAITING_UNITY_BUILD — place files in /public/unity/Build/"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HUD Overlays — visible once loaded */}
        {isLoaded && (
          <>
            {/* Top-left: system stats */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded-sm">
                <Terminal className="text-primary w-3 h-3" />
                <span
                  className="text-on-surface-variant uppercase tracking-tight"
                  style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
                >
                  LATENCY: 12ms
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1.5 rounded-sm">
                <MemoryStick className="text-primary w-3 h-3" />
                <span
                  className="text-on-surface-variant uppercase tracking-tight"
                  style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
                >
                  NODES: 4,092 ACTIVE
                </span>
              </div>
            </div>

            {/* Top-right: Gem counter HUD */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-primary/20">
                <span className="text-primary text-base">💎</span>
                <span
                  className="text-primary font-bold tracking-widest"
                  style={{ fontSize: "11px", fontFamily: "var(--font-label)" }}
                >
                  {gemsCollected}/{TOTAL_GEMS_PER_LEVEL}
                </span>
                <div className="w-16 h-0.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 shadow-[0_0_6px_#9fff88]"
                    style={{ width: `${gemPct}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dev Simulate Mint Button — always visible below canvas for testing */}
      <button
        onClick={onDevMint}
        className="absolute bottom-3 right-3 z-20 bg-primary/10 hover:bg-primary/25 border border-primary/30 text-primary px-3 py-1 rounded-sm backdrop-blur-md transition-all duration-200"
        style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
      >
        [DEV] SIMULATE_MINT_TRIGGER
      </button>
    </div>
  );
}

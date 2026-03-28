import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring } from "motion/react";
import { Fingerprint, Trophy, Church, Activity, Zap, Shield, Star, Radio } from "lucide-react";
import { cn } from "../lib/utils";
import { TOTAL_GEMS_PER_LEVEL, TOTAL_LEVELS } from "../constants";

/** ─── BentoHUD ──────────────────────────────────────────────────────────────── */
export default function BentoHUD({ playerStats, leaderboard, logs, walletAddress, isMinting, mintStatus, onMintClick }) {
  const container = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const card = {
    hidden:  { opacity: 0, y: 36, scale: 0.96 },
    visible: { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  const gemPct = Math.round((playerStats.gemsCollected / TOTAL_GEMS_PER_LEVEL) * 100);
  const lvlPct = Math.round((playerStats.levelsCompleted / TOTAL_LEVELS) * 100);
  const allGemsCollected = playerStats.gemsCollected >= TOTAL_GEMS_PER_LEVEL;

  return (
    <section
      id="deep-dive"
      className="snap-section relative flex items-center justify-center pt-20 pb-8 px-4 md:px-10 lg:px-14 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050705 0%, #0d0f0d 100%)" }}
    >
      {/* Section ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(159,255,136,0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      {/* Section Header */}
      <motion.div
        className="absolute top-20 left-0 w-full flex items-center gap-4 px-4 md:px-10 lg:px-14"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-6 h-px bg-primary/40" />
        <span className="text-primary/50 tracking-[0.35em] uppercase" style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}>
          DEEP_DIVE // SPECTRAL_CONSOLE_v2.4
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="flex items-center gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms`, opacity: 1 - i * 0.3 }} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-12 gap-3 w-full max-w-7xl"
        style={{ height: "76vh" }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >

        {/* ██████ CARD 1: PLAYER_BIO ██████████████████████████████████ */}
        <motion.div variants={card} className="col-span-12 md:col-span-4 row-span-4 relative group">
          <HudCard glowColor="rgba(159,255,136,0.08)" shine>
            {/* Card Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Fingerprint className="w-3 h-3 text-primary" />
                </div>
                <h3 className="text-primary tracking-[0.15em] uppercase font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "11px" }}>
                  PLAYER_BIO
                </h3>
              </div>
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
              </div>
            </div>

            {/* Avatar + Level */}
            <div className="flex items-center gap-4 mb-5 p-3 rounded-sm" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(159,255,136,0.06)" }}>
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl"
                  style={{ background: "rgba(159,255,136,0.08)", border: "1px solid rgba(159,255,136,0.2)" }}
                >
                  🐈
                </div>
                <div
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-sm flex items-center justify-center font-bold"
                  style={{ background: "#9fff88", fontFamily: "var(--font-label)", fontSize: "9px", color: "#026400" }}
                >
                  {playerStats.levelsCompleted}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-on-surface font-bold truncate" style={{ fontFamily: "var(--font-headline)", fontSize: "13px" }}>
                  HUSHCAT
                </p>
                <p className="text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}>
                  WANDERER · SPECTRAL_REALM
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-2.5 h-2.5 text-primary" />
                  <span className="text-primary font-bold" style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}>
                    {playerStats.score} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 flex-1">
              <AnimatedStatBar
                label="SPIRITUAL_ENERGY"
                sublabel="GEM RESONANCE"
                value={gemPct}
                count={playerStats.gemsCollected}
                total={TOTAL_GEMS_PER_LEVEL}
                color="#9fff88"
                glow="rgba(159,255,136,0.6)"
                pulseOnFull={allGemsCollected}
              />
              <AnimatedStatBar
                label="VOID_RESONANCE"
                sublabel="LEVEL PROGRESS"
                value={lvlPct}
                count={playerStats.levelsCompleted}
                total={TOTAL_LEVELS}
                color="#7af4ff"
                glow="rgba(122,244,255,0.5)"
              />

              {/* Quick stat chips */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <MiniChip label="GEMS" value={`${playerStats.gemsCollected}/${TOTAL_GEMS_PER_LEVEL}`} color="#9fff88" icon={<Shield className="w-2.5 h-2.5" />} />
                <MiniChip label="LEVELS" value={`${playerStats.levelsCompleted}/${TOTAL_LEVELS}`} color="#7af4ff" icon={<Zap className="w-2.5 h-2.5" />} />
                <MiniChip label="SCORE" value={playerStats.score} color="#9fff88" icon={<Star className="w-2.5 h-2.5" />} />
              </div>
            </div>

            {/* Wallet */}
            {walletAddress ? (
              <div className="mt-4 p-2.5 rounded-sm" style={{ background: "rgba(159,255,136,0.05)", border: "1px solid rgba(159,255,136,0.12)" }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "8px" }} className="text-primary/60 tracking-widest uppercase">NEURAL_LINK_ACTIVE</p>
                </div>
                <p style={{ fontFamily: "var(--font-label)", fontSize: "10px" }} className="text-on-surface/80 font-mono truncate">
                  {walletAddress.slice(0, 12)}...{walletAddress.slice(-6)}
                </p>
              </div>
            ) : (
              <div className="mt-4 p-2.5 rounded-sm" style={{ background: "rgba(71,72,70,0.08)", border: "1px solid rgba(71,72,70,0.12)" }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "8px" }} className="text-on-surface-variant/40 tracking-widest uppercase">WALLET_NOT_CONNECTED</p>
                </div>
              </div>
            )}
          </HudCard>
        </motion.div>

        {/* ██████ CARD 2: LEADERBOARD ██████████████████████████████████ */}
        <motion.div variants={card} className="col-span-12 md:col-span-8 row-span-2">
          <HudCard glowColor="rgba(159,255,136,0.05)">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <h3 className="text-primary tracking-[0.15em] uppercase font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "11px" }}>
                  LEADERBOARD
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant/40 uppercase" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>TOP_AGENTS</span>
                <div className="px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20">
                  <span className="text-primary" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
                    {leaderboard.length} REGISTERED
                  </span>
                </div>
              </div>
            </div>

            {leaderboard.length > 0 ? (
              <div className="space-y-1.5 overflow-y-auto scrollbar-hide" style={{ maxHeight: "calc(100% - 60px)" }}>
                <AnimatePresence>
                  {leaderboard.map((p, i) => (
                    <LeaderboardRow
                      key={p.walletAddress}
                      rank={i + 1}
                      player={p}
                      isSelf={p.walletAddress === walletAddress?.toLowerCase()}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState icon={<Activity className="w-5 h-5" />} label="SCANNING_FOR_AGENTS..." sublabel="Connect wallet and complete a level to appear here." />
            )}
          </HudCard>
        </motion.div>

        {/* ██████ CARD 3: ALTAR STATUS ██████████████████████████████████ */}
        <motion.div variants={card} className="col-span-12 md:col-span-5 row-span-2 flex flex-col">
          <HudCard glowColor="rgba(159,255,136,0.1)" className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Church className="w-4 h-4 text-primary" />
                  <h3 className="text-primary tracking-[0.15em] uppercase font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "11px" }}>
                    GENESIS_ALTAR
                  </h3>
                </div>
                <AltarStatusBadge mintStatus={mintStatus} />
              </div>

              {/* Altar visual */}
              <div className="relative flex items-center gap-4 p-3 rounded-sm mb-3" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(159,255,136,0.08)" }}>
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-sm flex items-center justify-center text-2xl transition-all duration-500",
                      allGemsCollected || mintStatus === "success"
                        ? "shadow-[0_0_24px_rgba(159,255,136,0.5)]"
                        : ""
                    )}
                    style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${allGemsCollected ? "rgba(159,255,136,0.5)" : "rgba(71,72,70,0.3)"}` }}
                  >
                    ⛩️
                  </div>
                  {(allGemsCollected || mintStatus === "success") && (
                    <div className="absolute inset-0 rounded-sm altar-ping" style={{ border: "2px solid rgba(159,255,136,0.6)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
                    {mintStatus === "success" ? "RITUAL_COMPLETE" : allGemsCollected ? "RITUAL_READY" : "GATHERING_NODES"}
                  </p>
                  <p className="text-on-surface font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "12px" }}>
                    {mintStatus === "success"
                      ? "POAP INSCRIBED ✓"
                      : allGemsCollected
                      ? "ALL GEMS RECEIVED"
                      : `${playerStats.gemsCollected}/${TOTAL_GEMS_PER_LEVEL} GEMS NEEDED`}
                  </p>
                  <div className="flex gap-1 mt-1.5">
                    {Array.from({ length: TOTAL_GEMS_PER_LEVEL }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-3 h-1 rounded-full transition-all duration-500",
                          i < playerStats.gemsCollected
                            ? "bg-primary shadow-[0_0_6px_rgba(159,255,136,0.8)]"
                            : "bg-outline-variant/30"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              id="mint-button"
              onClick={onMintClick}
              disabled={isMinting || mintStatus === "success"}
              className={cn(
                "w-full py-3 font-bold rounded-sm tracking-[0.2em] uppercase text-xs transition-all duration-300",
                mintStatus === "success"
                  ? "bg-surface-container-highest text-primary/60 cursor-default border border-primary/15"
                  : allGemsCollected
                  ? "hush-gradient-btn text-on-primary animate-pulse shadow-[0_0_20px_rgba(159,255,136,0.35)]"
                  : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:text-primary hover:border-primary/20",
                isMinting && "opacity-60 cursor-wait"
              )}
              style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
            >
              {isMinting ? "PROCESSING_RITUAL..." : mintStatus === "success" ? "GENESIS_POAP_BANKED ✓" : "INITIATE_RITUAL"}
            </button>
          </HudCard>
        </motion.div>

        {/* ██████ CARD 4: LIVE TELEMETRY ████████████████████████████████ */}
        <motion.div variants={card} className="col-span-12 md:col-span-7 row-span-2">
          <HudCard glowColor="rgba(122,244,255,0.04)" className="h-full flex flex-col" override style={{ background: "rgba(5,6,5,0.9)", border: "1px solid rgba(71,72,70,0.12)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
                <h3 className="text-on-surface-variant tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "10px" }}>
                  LIVE_TELEMETRY
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary/30 uppercase" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>UPTIME: OPERATIONAL</span>
                <div className="flex gap-0.5">
                  {[0,1,2,3].map(i => (
                    <div
                      key={i}
                      className="w-0.5 bg-primary rounded-full animate-pulse"
                      style={{ height: `${[6, 10, 8, 12][i]}px`, animationDelay: `${i * 100}ms`, opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Scanline */}
            <div className="h-px w-full mb-3" style={{ background: "linear-gradient(90deg, transparent, rgba(159,255,136,0.2), transparent)" }} />

            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => {
                  const sepIdx = log.indexOf(" > ");
                  const ts  = sepIdx >= 0 ? log.slice(0, sepIdx) : "";
                  const msg = sepIdx >= 0 ? log.slice(sepIdx + 3) : log;
                  const isGem    = msg.includes("GEM");
                  const isAltar  = msg.includes("ALTAR") || msg.includes("RITUAL") || msg.includes("SIGNAL");
                  const isErr    = msg.includes("ERROR") || msg.includes("FAILED");
                  const isDev    = msg.startsWith("DEV:");
                  return (
                    <motion.div
                      key={`${ts}-${i}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2.5"
                      style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}
                    >
                      <span className="text-outline-variant/60 whitespace-nowrap flex-shrink-0 mt-px">{ts}</span>
                      <span style={{ color: "rgba(255,255,255,0.15)" }} className="flex-shrink-0 mt-px">›</span>
                      <span
                        className={cn(
                          "uppercase leading-tight break-all",
                          isErr   && "text-red-400",
                          isAltar && !isErr && "text-primary font-bold",
                          isGem   && !isErr && "text-primary/85",
                          isDev   && "text-tertiary/70",
                          !isErr && !isAltar && !isGem && !isDev && "text-on-surface-variant/60"
                        )}
                      >
                        {msg}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Blinking cursor */}
              <div className="flex items-center gap-2.5" style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}>
                <span className="text-outline-variant/60 whitespace-nowrap">
                  {new Date().toLocaleTimeString([], { hour12: false })}
                </span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>›</span>
                <span className="text-primary/40 uppercase animate-pulse">MONITORING_SPECTRAL_CHANNELS_</span>
              </div>
            </div>
          </HudCard>
        </motion.div>

      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                              */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Generic glass card wrapper */
function HudCard({ children, glowColor, className, shine, override, style: overrideStyle }) {
  return (
    <div
      className={cn("relative h-full p-5 rounded-md overflow-hidden transition-all duration-500 group/card", className)}
      style={{
        background:   override ? undefined : "rgba(18,20,18,0.82)",
        border:       "1px solid rgba(71,72,70,0.18)",
        backdropFilter: "blur(16px)",
        boxShadow:    `0 0 0 1px rgba(71,72,70,0.05), inset 0 1px 0 rgba(255,255,255,0.03)`,
        ...overrideStyle,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-md pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, transparent 60%)` }}
      />
      {/* Subtle top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none opacity-40"
        style={{ background: "linear-gradient(90deg, transparent, rgba(159,255,136,0.3), transparent)" }}
      />
      {children}
    </div>
  );
}

/** Animated stat bar with number counting and glow */
function AnimatedStatBar({ label, sublabel, value, count, total, color, glow, pulseOnFull }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  useEffect(() => { spring.set(value); }, [value, spring]);
  const [display, setDisplay] = useState(0);
  useEffect(() => spring.on("change", (v) => setDisplay(Math.round(v))), [spring]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between" style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}>
        <div>
          <span className="text-on-surface-variant uppercase tracking-widest">{label}</span>
          {sublabel && <span className="text-on-surface-variant/30 ml-2">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-on-surface/60">{count}/{total}</span>
          <span className="font-bold" style={{ color }}>{display}%</span>
        </div>
      </div>
      <div className="h-1 bg-surface-container-highest w-full rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: display > 0 ? `0 0 10px ${glow}` : "none",
          }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {pulseOnFull && value >= 100 && (
        <p className="text-primary animate-pulse uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
          ✦ ALL GEMS COLLECTED — ALTAR AWAITS
        </p>
      )}
    </div>
  );
}

/** Mini stat chip */
function MiniChip({ label, value, color, icon }) {
  return (
    <div className="rounded-sm p-2" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(71,72,70,0.15)" }}>
      <div className="flex items-center gap-1 mb-1" style={{ color }}>
        {icon}
        <span style={{ fontFamily: "var(--font-label)", fontSize: "7px" }} className="uppercase tracking-widest text-on-surface-variant/50">{label}</span>
      </div>
      <p className="font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "13px", color }}>{value}</p>
    </div>
  );
}

/** Leaderboard row with rank indicator */
function LeaderboardRow({ rank, player, isSelf, index }) {
  const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-sm border transition-all duration-300",
        isSelf
          ? "border-primary/30 bg-primary/8"
          : "border-outline-variant/8 bg-surface-container-highest/30 hover:border-outline-variant/20"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className="font-bold w-5 text-center flex-shrink-0"
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "9px",
            color: rank <= 3 ? rankColors[rank - 1] : "rgba(171,171,168,0.4)",
          }}
        >
          {rank <= 3 ? ["①", "②", "③"][rank - 1] : String(rank).padStart(2, "0")}
        </span>
        <span className="text-on-surface/80 font-mono" style={{ fontFamily: "var(--font-headline)", fontSize: "10px" }}>
          {player.walletAddress.slice(0, 6)}...{player.walletAddress.slice(-4)}
        </span>
        {isSelf && <span className="text-primary" style={{ fontFamily: "var(--font-label)", fontSize: "7px" }}>[YOU]</span>}
        {player.mintedGenesisPoap && <span className="text-primary" title="Genesis POAP Minted" style={{ fontSize: "10px" }}>⬡</span>}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-on-surface-variant/50" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
          LVL {player.levelsCompleted}/{TOTAL_LEVELS}
        </span>
        <span className="text-primary font-bold" style={{ fontFamily: "var(--font-headline)", fontSize: "12px" }}>
          {player.score}
        </span>
      </div>
    </motion.div>
  );
}

/** Altar status pill */
function AltarStatusBadge({ mintStatus }) {
  const states = {
    success: { label: "INSCRIBED",  bg: "rgba(159,255,136,0.15)", color: "#9fff88", pulse: false },
    pending: { label: "PROCESSING", bg: "rgba(255,200,50,0.1)",   color: "#ffd93d", pulse: true },
    error:   { label: "FAILED",     bg: "rgba(248,113,113,0.12)",  color: "#f87171", pulse: false },
    idle:    { label: "STANDBY",    bg: "rgba(71,72,70,0.15)",    color: "#ababa8", pulse: false },
  };
  const s = states[mintStatus] ?? states.idle;
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: s.bg, border: `1px solid ${s.color}30` }}>
      <div className={cn("w-1.5 h-1.5 rounded-full", s.pulse && "animate-pulse")} style={{ background: s.color }} />
      <span style={{ fontFamily: "var(--font-label)", fontSize: "8px", color: s.color }}>{s.label}</span>
    </div>
  );
}

/** Empty state placeholder */
function EmptyState({ icon, label, sublabel }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-30">
      <div className="text-primary">{icon}</div>
      <p style={{ fontFamily: "var(--font-label)", fontSize: "9px" }} className="text-on-surface-variant tracking-widest uppercase">{label}</p>
      {sublabel && <p style={{ fontFamily: "var(--font-label)", fontSize: "8px" }} className="text-on-surface-variant/50 text-center">{sublabel}</p>}
    </div>
  );
}

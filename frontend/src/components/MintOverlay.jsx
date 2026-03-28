import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { HUSH_CHAIN } from "../constants";

/**
 * MintOverlay — Full-screen modal that appears during minting.
 * Shows the signing flow, tx hash, and success/error states.
 */
export default function MintOverlay({ mintStatus, mintTxHash, onClose }) {
  const isVisible = mintStatus !== "idle";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center mint-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="glass-panel rounded-xl border border-primary/20 p-8 w-full max-w-md mx-4 shadow-[0_0_60px_rgba(159,255,136,0.15)]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary altar-ping" />
              <h2
                className="text-primary font-bold tracking-widest"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                {mintStatus === "pending" && "ARCHIVING_HEROIC_ACT..."}
                {mintStatus === "success" && "RITUAL_COMPLETE ✓"}
                {mintStatus === "error"   && "RITUAL_FAILED ✗"}
              </h2>
            </div>

            {/* Status Messages */}
            <div
              className="space-y-2 bg-black/60 rounded-sm p-4 mb-6 border border-outline-variant/10"
              style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}
            >
              {mintStatus === "pending" && (
                <>
                  <LogLine timestamp delay={0}>INITIATING_HANDSHAKE_WITH_HUSH_CHAIN</LogLine>
                  <LogLine timestamp delay={0.5}>AWAITING_METAMASK_SIGNATURE...</LogLine>
                  <LogLine timestamp delay={1.0} pulse>BROADCASTING_TRANSACTION_</LogLine>
                </>
              )}
              {mintStatus === "success" && (
                <>
                  <LogLine timestamp delay={0}>TRANSACTION_CONFIRMED_ON_HUSH_CHAIN</LogLine>
                  <LogLine timestamp delay={0.2}>GENESIS_POAP_MINTED_TO_YOUR_WALLET</LogLine>
                  {mintTxHash && (
                    <LogLine timestamp delay={0.4}>
                      TX: {mintTxHash.slice(0, 16)}...{mintTxHash.slice(-8)}
                    </LogLine>
                  )}
                  <LogLine timestamp delay={0.6} green>ALTAR_RESONANCE_SCAN: 100%_STABLE ✓</LogLine>
                </>
              )}
              {mintStatus === "error" && (
                <>
                  <LogLine timestamp delay={0} red>RITUAL_SEQUENCE_INTERRUPTED</LogLine>
                  <LogLine timestamp delay={0.2} red>CHECK_METAMASK_&_RETRY</LogLine>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {mintStatus === "success" && mintTxHash && (
                <a
                  href={`${HUSH_CHAIN.blockExplorer}/tx/${mintTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 hush-gradient-btn text-on-primary text-center font-bold rounded-sm"
                  style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}
                >
                  VIEW_ON_EXPLORER →
                </a>
              )}
              {(mintStatus === "success" || mintStatus === "error") && (
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all rounded-sm font-bold"
                  style={{ fontFamily: "var(--font-label)", fontSize: "10px" }}
                >
                  CLOSE
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Inner log line component for the terminal-style status area */
function LogLine({ children, delay = 0, pulse, green, red, timestamp }) {
  return (
    <motion.p
      className={cn(
        "flex gap-3",
        pulse && "animate-pulse",
        green && "text-primary",
        red   && "text-red-400",
        !green && !red && "text-primary/70"
      )}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {timestamp && (
        <span className="text-on-surface-variant whitespace-nowrap">
          {new Date().toLocaleTimeString([], { hour12: false })}
        </span>
      )}
      <span className="text-white/30">&gt;</span>
      <span className="uppercase">{children}</span>
    </motion.p>
  );
}

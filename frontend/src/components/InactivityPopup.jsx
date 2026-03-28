import { ShieldAlert, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function InactivityPopup({ show, onResume }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md p-6 relative overflow-hidden flex flex-col items-center text-center rounded-sm border border-red-500/30 bg-black/95 shadow-[0_0_50px_rgba(239,68,68,0.15)]"
          >
            {/* Background warning scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(239,68,68,0.2)_50%)] bg-[length:100%_4px]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 animate-pulse" />

            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 relative z-10">
              <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              <div className="absolute inset-0 rounded-full border border-red-500/50 animate-ping" />
            </div>

            <h2 className="text-red-400 font-bold tracking-[0.2em] text-xl mb-2 relative z-10" style={{ fontFamily: "var(--font-headline)" }}>
              SIGNAL DEGRADED
            </h2>
            
            <p className="text-on-surface-variant/80 text-[11px] tracking-widest leading-relaxed mb-8 relative z-10" style={{ fontFamily: "var(--font-label)" }}>
              Neural link stabilizing... No agent activity detected for 60 seconds. <br/><br/>
              Please confirm your presence to maintain connection to the Odyssey Network.
            </p>

            <button
              onClick={onResume}
              className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/60 transition-all font-bold tracking-[0.2em] flex items-center justify-center gap-3 uppercase cursor-pointer relative z-10"
              style={{ fontFamily: "var(--font-headline)", fontSize: "12px" }}
            >
              <Activity className="w-4 h-4 animate-pulse" />
              RE-ESTABLISH LINK
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

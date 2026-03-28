import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function ObjectivePopup() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.5 }}
        >
          <motion.div
            className="glass-panel flex flex-col rounded-xl border border-primary/40 p-8 w-full max-w-lg mx-4 shadow-[0_0_80px_rgba(159,255,136,0.25)] relative overflow-hidden"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut", type: "spring", bounce: 0.4 }}
          >
            {/* Background flourish */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/50 shadow-[0_0_30px_rgba(159,255,136,0.3)]">
                <span className="text-3xl" role="img" aria-label="gem">💎</span>
              </div>

              <h2
                className="text-primary font-bold tracking-[0.2em] text-2xl mb-4 uppercase"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                Hush Odyssey Mission
              </h2>

              <div className="space-y-4 mb-8 text-on-surface-variant leading-relaxed text-sm md:text-base">
                <p>
                  Welcome Explorer. Your objective is crucial: <span className="text-primary font-semibold">Find the invisible gems</span> scattered across the game map.
                </p>
                <div className="h-[1px] w-1/2 mx-auto bg-primary/30 my-2" />
                <p>
                  Each gem collected brings you closer to earning a unique <span className="text-primary font-semibold">POAP token reward</span>.
                </p>
                <div className="h-[1px] w-1/2 mx-auto bg-primary/30 my-2" />
                <p>
                  Once you collect all required gems, you will unlock the power to <span className="text-primary font-semibold">initiate the Ritual</span> and transact Hush tokens on the Hush Chain.
                </p>
                <p className="mt-6 italic text-on-surface-variant/90">
                  "Note: Going near the castle gate will end the game."
                </p>
              </div>

              <button
                onClick={() => setIsVisible(false)}
                className="w-full py-4 hush-gradient-btn text-on-primary font-bold tracking-[0.2em] rounded-sm hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(159,255,136,0.3)]"
                style={{ fontFamily: "var(--font-label)", fontSize: "12px" }}
              >
                [ ACCEPT MISSION ]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

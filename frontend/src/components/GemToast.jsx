import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TOTAL_GEMS_PER_LEVEL } from "../constants";

export default function GemToast({ toasts, removeToast }) {
  return (
    <div className="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="glass-panel px-4 py-3 rounded-md flex items-center gap-4 border border-primary/50 shadow-[0_0_20px_rgba(159,255,136,0.25)] bg-black/80 backdrop-blur-md pointer-events-auto min-w-[260px]"
    >
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-xl shadow-[0_0_15px_rgba(159,255,136,0.3)] shrink-0">
        <span role="img" aria-label="gem">💎</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-primary font-bold tracking-[0.15em] text-xs uppercase" style={{ fontFamily: "var(--font-headline)" }}>
          {toast.delta > 0 ? `+${toast.delta} GEM RECOVERED` : "GEM RECOVERED"}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 bg-surface-container-highest rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary" 
               style={{ width: `${(toast.currentCount / TOTAL_GEMS_PER_LEVEL) * 100}%` }} 
             />
          </div>
          <p className="text-on-surface-variant text-[9px] uppercase tracking-widest font-bold font-mono shrink-0">
            {toast.currentCount}/{TOTAL_GEMS_PER_LEVEL} 
          </p>
        </div>
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="text-on-surface-variant/50 hover:text-white transition-colors p-1 shrink-0 ml-1"
      >
        ✕
      </button>
    </motion.div>
  );
}

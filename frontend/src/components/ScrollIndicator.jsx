import React from "react";
import { motion } from "motion/react";

/**
 * ScrollIndicator — Animated "SCROLL_FOR_DATA" indicator shown at the bottom
 * of the hero section. Fades out when the user has scrolled down.
 */
export default function ScrollIndicator({ visible = true }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-20"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Label */}
      <span
        className="text-primary/55 uppercase tracking-[0.3em]"
        style={{ fontSize: "10px", fontFamily: "var(--font-label)" }}
      >
        SCROLL_FOR_DATA
      </span>

      {/* Vertical animated line */}
      <div className="relative h-12 w-px bg-gradient-to-b from-primary/60 to-transparent overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-primary shadow-[0_0_8px_#9fff88]"
          style={{ height: "40%" }}
          animate={{ y: ["0%", "160%", "0%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Chevron dots */}
      <div className="flex flex-col items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-primary scroll-indicator-dot"
            style={{ animationDelay: `${i * 0.2}s`, opacity: 1 - i * 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

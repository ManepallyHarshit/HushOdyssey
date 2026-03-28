import React from "react";
import { Terminal, Github, Twitter, Disc as Discord } from "lucide-react";
import { HUSH_CHAIN } from "../constants";

/**
 * Header — Fixed top navigation with glassmorphism, wallet state, and section links.
 */
export default function Header({ walletAddress, isConnecting, onConnect, activeSection }) {
  const navLinks = [
    { id: "command",   label: "COMMAND"   },
    { id: "deep-dive", label: "DEEP DIVE" },
    { id: "altar",     label: "ALTAR"     },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 w-full z-50 border-b border-outline-variant/15 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      style={{ background: "rgba(13,15,13,0.85)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex justify-between items-center px-6 md:px-8 h-16 w-full max-w-screen-2xl mx-auto">

        {/* Logo */}
        <div
          className="text-xl font-bold tracking-widest text-primary glow-text-primary uppercase cursor-pointer"
          style={{ fontFamily: "var(--font-headline)" }}
          onClick={() => scrollTo("command")}
        >
          HUSH ODYSSEY
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8" style={{ fontFamily: "var(--font-label)" }}>
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                "tracking-tighter uppercase text-xs transition-all duration-300 pb-0.5",
                activeSection === id
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary border-b-2 border-transparent",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className={[
              "tracking-tighter uppercase text-xs px-4 py-2 rounded-sm transition-all duration-300",
              walletAddress
                ? "text-primary bg-primary/10 border border-primary/30"
                : "text-on-surface-variant hover:text-primary hover:bg-primary/10",
              isConnecting && "opacity-50 cursor-wait",
            ].join(" ")}
            style={{ fontFamily: "var(--font-label)" }}
          >
            {isConnecting
              ? "LINKING..."
              : walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "CONNECT WALLET"}
          </button>

          <a
            href={HUSH_CHAIN.blockExplorer}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex tracking-tighter uppercase text-xs bg-primary text-on-primary px-4 py-2 rounded-sm font-bold hover:shadow-[0_0_16px_rgba(159,255,136,0.4)] transition-all duration-200 active:scale-95"
            style={{ fontFamily: "var(--font-label)" }}
          >
            EXPLORER
          </a>
        </div>

      </div>
    </header>
  );
}

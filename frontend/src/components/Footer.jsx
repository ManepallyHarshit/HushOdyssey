import React from "react";
import { motion } from "motion/react";
import { Terminal, Github, Twitter, Disc as Discord } from "lucide-react";
import { HUSH_CHAIN } from "../constants";

/**
 * Footer — Technical footer with social links, chain status, and atmospheric glow.
 */
export default function Footer() {
  return (
    <footer
      id="altar"
      className="snap-section flex flex-col justify-center items-center border-t border-outline-variant/10 px-8 md:px-16 relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Atmospheric glow orbs */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <motion.div
        className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-12 z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Left: Brand */}
        <div className="flex flex-col gap-3">
          <div
            className="text-primary font-bold text-2xl tracking-tighter glow-text-primary"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            HUSH ODYSSEY
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span
              className="text-on-surface-variant uppercase tracking-[0.18em]"
              style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
            >
              © 2024 HUSH CHAIN STATUS: <span className="text-primary">OPERATIONAL</span>
            </span>
          </div>
          <div
            className="text-on-surface-variant/50 uppercase tracking-[0.15em]"
            style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
          >
            CONTRACT: {HUSH_CHAIN.contractAddress.slice(0, 10)}...{HUSH_CHAIN.contractAddress.slice(-6)}
          </div>
        </div>

        {/* Right: Links */}
        <div className="flex flex-wrap justify-center gap-14">
          {/* Communication */}
          <FooterLinkGroup title="COMMUNICATION">
            <FooterLink href="https://x.com" icon={<Twitter className="w-3 h-3" />}>X_CORP</FooterLink>
            <FooterLink href="https://discord.com" icon={<Discord className="w-3 h-3" />}>DISCORD</FooterLink>
          </FooterLinkGroup>

          {/* Knowledge */}
          <FooterLinkGroup title="KNOWLEDGE">
            <FooterLink href="#" icon={<Terminal className="w-3 h-3" />}>DOCS</FooterLink>
            <FooterLink
              href={`${HUSH_CHAIN.blockExplorer}/address/${HUSH_CHAIN.contractAddress}`}
              icon={<Github className="w-3 h-3" />}
            >
              CONTRACT
            </FooterLink>
          </FooterLinkGroup>

          {/* Chain */}
          <FooterLinkGroup title="NETWORK">
            <FooterLink href={HUSH_CHAIN.blockExplorer}>EXPLORER</FooterLink>
            <FooterLink href={HUSH_CHAIN.rpcUrl}>RPC_NODE</FooterLink>
          </FooterLinkGroup>
        </div>
      </motion.div>
    </footer>
  );
}

function FooterLinkGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-primary/35 uppercase tracking-widest"
        style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
      >
        {title}
      </span>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-on-surface-variant hover:text-primary hover:tracking-[0.3em] transition-all duration-500 uppercase"
      style={{ fontFamily: "var(--font-headline)", fontSize: "10px", letterSpacing: "0.2em" }}
    >
      {icon && <span className="text-primary/50">{icon}</span>}
      {children}
    </a>
  );
}

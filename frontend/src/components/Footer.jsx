import React from "react";
import { motion } from "motion/react";
import { Terminal, Github, Twitter, Disc as Discord, ArrowUpRight } from "lucide-react";
import { HUSH_CHAIN } from "../constants";

/**
 * Footer — Technical footer with social links, chain status, and atmospheric glow.
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="altar"
      className="snap-section relative flex flex-col justify-center items-center border-t border-primary/10 pt-24 pb-12 px-8 md:px-16 overflow-hidden z-20"
      style={{
        background: "radial-gradient(ellipse at bottom center, rgba(159,255,136,0.06) 0%, rgba(5,7,5,1) 50%, rgba(0,0,0,1) 100%)"
      }}
    >
      {/* Decorative Top Border Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-primary blur-md" />

      {/* Atmospheric glow orbs */}
      <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Cyber Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(159,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(159,255,136,0.05) 1px, transparent 1px)", 
          backgroundSize: "30px 30px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 80%, transparent)"
        }} 
      />

      <motion.div
        className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16 z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Left: Brand & Story */}
        <div className="flex flex-col gap-6 max-w-md">
          <div className="flex flex-col gap-1">
            <div
              className="font-black text-4xl tracking-[0.2em] transform-gpu hover:scale-[1.02] transition-transform duration-500 cursor-default"
              style={{ 
                fontFamily: "var(--font-headline)",
                background: "linear-gradient(to right, #ffffff 0%, #9fff88 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent"
              }}
            >
              HUSH ODYSSEY
            </div>
            <p className="text-on-surface-variant/60 leading-relaxed text-sm mt-3" style={{ fontFamily: "var(--font-label)" }}>
              A decentralized spectral realm navigating the boundaries of reality. Explore the map, claim your hidden legacy, and lock your achievements permanently into the Hush Chain.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 p-4 rounded-sm border border-primary/10 bg-black/40 backdrop-blur-sm self-start">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#9fff88]" />
              <span
                className="text-on-surface-variant uppercase tracking-[0.18em]"
                style={{ fontFamily: "var(--font-label)", fontSize: "9px" }}
              >
                NETWORK STATUS: <span className="text-primary font-bold">OPERATIONAL</span>
              </span>
            </div>
            <div
              className="text-on-surface-variant/40 uppercase tracking-[0.15em] font-mono group cursor-pointer"
              style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}
              onClick={() => window.open(`${HUSH_CHAIN.blockExplorer}/address/${HUSH_CHAIN.contractAddress}`, '_blank')}
            >
              <span className="group-hover:text-primary transition-colors">
                SYS_CONTRACT_ID: {HUSH_CHAIN.contractAddress.slice(0, 10)}...{HUSH_CHAIN.contractAddress.slice(-6)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Links Group */}
        <div className="flex flex-wrap justify-start lg:justify-end gap-x-16 gap-y-10">
          {/* Communication */}
          <FooterLinkGroup title="COMMUNICATION">
            <FooterLink href="https://x.com" icon={<Twitter className="w-3.5 h-3.5" />}>X_CORP</FooterLink>
            <FooterLink href="https://discord.com" icon={<Discord className="w-3.5 h-3.5" />}>DISCORD</FooterLink>
          </FooterLinkGroup>

          {/* Knowledge */}
          <FooterLinkGroup title="KNOWLEDGE DATABASE">
            <FooterLink href="#" icon={<Terminal className="w-3.5 h-3.5" />}>DOCUMENTATION</FooterLink>
            <FooterLink
              href={`${HUSH_CHAIN.blockExplorer}/address/${HUSH_CHAIN.contractAddress}`}
              icon={<Github className="w-3.5 h-3.5" />}
            >
              SMART_CONTRACT
            </FooterLink>
          </FooterLinkGroup>

          {/* Chain */}
          <FooterLinkGroup title="NETWORK NODES">
            <FooterLink href={HUSH_CHAIN.blockExplorer}>BLOCK_EXPLORER</FooterLink>
            <FooterLink href={HUSH_CHAIN.rpcUrl}>RPC_MAINFRAME</FooterLink>
          </FooterLinkGroup>
        </div>
      </motion.div>

      {/* Bottom Legal & Scroll Top */}
      <div className="w-full max-w-7xl mt-20 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <p className="text-white/30 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
          © {new Date().getFullYear()} HUSH PROTOCOL // ALL RIGHTS RESERVED
        </p>
        
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 group px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
        >
          <span className="text-white/50 group-hover:text-primary tracking-[0.2em] transition-colors" style={{ fontFamily: "var(--font-label)", fontSize: "8px" }}>
            RETURN TO SURFACE
          </span>
          <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-primary uppercase tracking-[0.25em] font-bold"
        style={{ fontFamily: "var(--font-headline)", fontSize: "10px" }}
      >
        {title}
      </span>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({ href, icon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-on-surface-variant hover:text-white transition-all duration-300 uppercase relative"
      style={{ fontFamily: "var(--font-label)", fontSize: "10px", letterSpacing: "0.15em" }}
    >
      {icon && <span className="text-primary/50 group-hover:text-primary transition-colors">{icon}</span>}
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
      </span>
    </a>
  );
}

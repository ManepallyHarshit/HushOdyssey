import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { HUSH_CHAIN } from "../constants";
import GenesisABI from "../contracts/GenesisProtocol.json";

/**
 * useMint — Manages the POAP minting lifecycle.
 *
 * Returns:
 *   mintPoap    — async fn(walletAddress) → triggers MetaMask + contract call
 *   isMinting   — boolean loading state
 *   mintStatus  — "idle" | "pending" | "success" | "error"
 *   mintTxHash  — transaction hash on success
 */
export function useMint(addLog) {
  const [isMinting, setIsMinting]   = useState(false);
  const [mintStatus, setMintStatus] = useState("idle");   // idle | pending | success | error
  const [mintTxHash, setMintTxHash] = useState(null);

  const mintPoap = useCallback(async (walletAddress) => {
    if (!walletAddress) {
      addLog?.("MINT_FAILED: wallet not connected");
      return;
    }
    if (!window.ethereum) {
      addLog?.("MINT_FAILED: MetaMask not found");
      return;
    }

    setIsMinting(true);
    setMintStatus("pending");
    addLog?.("INITIATING_RITUAL — MINTING_GENESIS_POAP...");

    try {
      const provider  = new ethers.BrowserProvider(window.ethereum);
      const signer    = await provider.getSigner();
      const contract  = new ethers.Contract(
        HUSH_CHAIN.contractAddress,
        GenesisABI,
        signer
      );

      const tx = await contract.mintGenesis(walletAddress);
      addLog?.(`TX_SUBMITTED: ${tx.hash.slice(0, 10)}...`);

      await tx.wait();
      setMintTxHash(tx.hash);
      setMintStatus("success");
      addLog?.("RITUAL_COMPLETE — POAP_ARCHIVED_ON_HUSH_CHAIN ✓");

      // Notify backend (fire-and-forget — no DB, just in-memory state)
      await fetch("/api/player/mint-success", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ walletAddress }),
      }).catch(() => {}); // swallow if backend isn't running

    } catch (err) {
      setMintStatus("error");
      const msg = err?.reason ?? err?.message ?? "Unknown error";
      addLog?.(`RITUAL_FAILED: ${msg}`);
    } finally {
      setIsMinting(false);
    }
  }, [addLog]);

  const resetMint = useCallback(() => {
    setMintStatus("idle");
    setMintTxHash(null);
  }, []);

  return { mintPoap, isMinting, mintStatus, mintTxHash, resetMint };
}

import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { HUSH_CHAIN } from "../constants";

/**
 * useWallet — MetaMask connection, Hush Chain network switch, address state.
 *
 * Returns:
 *   walletAddress  — connected wallet (null when disconnected)
 *   isConnecting   — loading flag during connection handshake
 *   connectWallet  — call to prompt MetaMask
 *   disconnect     — clears local state (MetaMask keeps its own session)
 */
export function useWallet(addLog) {
  const [walletAddress, setWalletAddress]   = useState(null);
  const [isConnecting, setIsConnecting]     = useState(false);

  /** Ensure the user is on Hush Chain; add it if not present. */
  const ensureHushChain = useCallback(async (provider) => {
    const network = await provider.getNetwork();
    if (network.chainId.toString() === HUSH_CHAIN.chainId) return; // already correct

    addLog?.("WRONG_NETWORK — SWITCHING_TO_HUSH_CHAIN...");
    const hexChainId = `0x${BigInt(HUSH_CHAIN.chainId).toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });
    } catch (err) {
      // 4902 = chain not added yet
      if (err.code === 4902 || (err.message && err.message.includes("Unrecognized chain ID"))) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId:         hexChainId,
            chainName:       HUSH_CHAIN.name,
            rpcUrls:         [HUSH_CHAIN.rpcUrl],
            nativeCurrency:  { name: "HUSH", symbol: "HUSH", decimals: 18 },
            blockExplorerUrls: [HUSH_CHAIN.blockExplorer],
          }],
        });
      } else {
        throw err;
      }
    }

    addLog?.("HUSH_CHAIN_CONNECTED");
  }, [addLog]);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      addLog?.("METAMASK_NOT_FOUND — install MetaMask to continue");
      return null;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address  = accounts[0];

      setWalletAddress(address);
      addLog?.(`NEURAL_LINK: ${address.slice(0, 6)}...${address.slice(-4)}`);

      await ensureHushChain(provider);
      return address;
    } catch (err) {
      addLog?.(`CONNECTION_FAILED: ${err.message}`);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [ensureHushChain, addLog]);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    addLog?.("NEURAL_LINK_SEVERED");
  }, [addLog]);

  // Stay in sync if user manually changes account in MetaMask extension
  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setWalletAddress(accounts[0]);
        addLog?.(`ACCOUNT_CHANGED: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
      }
    };
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum.removeListener("accountsChanged", handler);
  }, [disconnect, addLog]);

  return { walletAddress, isConnecting, connectWallet, disconnect };
}

import { useEffect, useCallback, useState } from "react";
import { useUnityContext } from "react-unity-webgl";
import { TOTAL_GEMS_PER_LEVEL } from "../constants";

/**
 * useUnityBridge — Manages the Unity WebGL context and the two-way React↔Unity bridge.
 *
 * The bridge listens for browser CustomEvents dispatched by WebGLBridge.jslib:
 *   - "TriggerPoapMint"  → calls onMintTrigger()
 *   - "SyncScore"        → calls onGemSync(count)
 *
 * It also exposes window.triggerPoapMint() and window.syncScore() as fallbacks
 * for dev testing without a live Unity build.
 *
 * Returns: the full useUnityContext result + helpers.
 */
export function useUnityBridge({ onMintTrigger, onGemSync, addLog }) {
  const unityCtx = useUnityContext({
    loaderUrl:    "/unity/Build/WebBuild.loader.js",
    dataUrl:      "/unity/Build/WebBuild.data.br",
    frameworkUrl: "/unity/Build/WebBuild.framework.js.br",
    codeUrl:      "/unity/Build/WebBuild.wasm.br",
  });

  const { loadingProgression, isLoaded } = unityCtx;

  const [gameFullyStartedTime, setGameFullyStartedTime] = useState(0);

  // ── Listen for CustomEvents from WebGLBridge.jslib ─────────────────────────

  const handleMintEvent = useCallback((e) => {
    const detail = e.detail ?? "level_complete";
    console.log("[useUnityBridge] TriggerPoapMint received:", detail);
    addLog?.(`ALTAR_SIGNAL_RECEIVED: ${detail}`);
    onMintTrigger?.(detail);
  }, [onMintTrigger, addLog]);

  const handleScoreEvent = useCallback((e) => {
    // Unity's JS_SyncScore sends an int, but CustomEvent wraps it so
    // e.detail may arrive as a number or string — coerce both safely
    const raw  = e.detail;
    const gems = Number(raw);
    console.log("[useUnityBridge] SyncScore raw:", raw, "parsed:", gems);
    if (Number.isNaN(gems)) {
      addLog?.(`GEM_SYNC_ERROR: invalid payload "${raw}"`);
      return;
    }
    const pct = Math.round((gems / TOTAL_GEMS_PER_LEVEL) * 100);
    addLog?.(`RAW_GEM_EVENT: count=${gems} (${pct}%)`);
    onGemSync?.(gems);
  }, [onGemSync, addLog]);

  useEffect(() => {
    window.addEventListener("TriggerPoapMint", handleMintEvent);
    window.addEventListener("SyncScore",       handleScoreEvent);
    return () => {
      window.removeEventListener("TriggerPoapMint", handleMintEvent);
      window.removeEventListener("SyncScore",       handleScoreEvent);
    };
  }, [handleMintEvent, handleScoreEvent]);

  // ── Dev fallbacks — callable from DevTools or the [DEV] button ─────────────
  useEffect(() => {
    // Expose helpers on window for DevTools testing
    window.triggerPoapMint = (payload = "dev_altar_trigger") => {
      console.log("[DEV] triggerPoapMint called:", payload);
      addLog?.("DEV: triggerPoapMint() called via DevTools");
      onMintTrigger?.(payload);
    };
    window.syncScore = (gems) => {
      const n = Number(gems);
      console.log("[DEV] syncScore called:", n);
      addLog?.(`DEV: syncScore(${n}) called via DevTools`);
      onGemSync?.(n);
    };
    // Simulate full gem run for testing
    window.simulateGemRun = () => {
      addLog?.(`DEV: simulateGemRun() — ${TOTAL_GEMS_PER_LEVEL} gem events`);
      let i = 1;
      const t = setInterval(() => {
        window.syncScore(i);
        if (++i > TOTAL_GEMS_PER_LEVEL) clearInterval(t);
      }, 500);
    };
    return () => {
      delete window.triggerPoapMint;
      delete window.syncScore;
      delete window.simulateGemRun;
    };
  }, [onMintTrigger, onGemSync, addLog]);

  // ── Auto-Repair: Intercept Unity UI Unicode Errors ──────────────────────────
  // If the Unity Bridge fails but the game prints the Emoji warning, we intercept it!
  useEffect(() => {
    const fullyLoaded =
      isLoaded || (typeof loadingProgression === "number" && loadingProgression >= 1);
    if (fullyLoaded && gameFullyStartedTime === 0) {
      setGameFullyStartedTime(Date.now());
    }
  }, [loadingProgression, isLoaded, gameFullyStartedTime]);

  useEffect(() => {
    const originalWarn  = console.warn;
    const originalError = console.error;
    let fallbackGems = 0; 
    let lastGemTime = 0; 

    const handleUnityFontError = (msg) => {
      if (typeof msg !== 'string') return false;

      // Look for the specific TextMeshPro missing emoji metric warning 
      if (msg.includes('U0001F48E') || msg.includes('💎') || msg.includes('LiberationSans SDF')) {
          
          // REFACTOR #1: The Warmup Shield
          // If the game hasn't fully loaded, OR it loaded less than 3 seconds ago, ignore the warning!
          // This blocks the "1 or 2 gems at startup" bug perfectly regardless of loading speed.
          if (gameFullyStartedTime === 0 || (Date.now() - gameFullyStartedTime) < 3000) {
              console.log("[useUnityBridge] Shielding startup font error...");
              return true; 
          }

          // REFACTOR #2: The Spammer Shield 
          // Debounce: Only accept a gem collection if 1.5 seconds have passed since the last one.
          const now = Date.now();
          if (now - lastGemTime < 1500) return true;
          
          lastGemTime = now; // Register valid hit!
          fallbackGems++;
          fallbackGems = Math.min(fallbackGems, TOTAL_GEMS_PER_LEVEL);
          
          addLog?.(`AUTO_REPAIR_TRIGGER: Caught Unity Unicode Error. Extracted Gem ${fallbackGems}!`);
          onGemSync?.(fallbackGems);

          // The Altar check remains disabled so it triggers via normal collision detection.
          return true;
      }
      return false;
    };

    console.warn = function() {
      handleUnityFontError(arguments[0]);
      return originalWarn.apply(console, arguments);
    };

    console.error = function() {
      handleUnityFontError(arguments[0]);
      return originalError.apply(console, arguments);
    };

    return () => {
      console.warn  = originalWarn;
      console.error = originalError;
    };
  }, [onGemSync, addLog, gameFullyStartedTime]);

  return unityCtx;
}

using UnityEngine;
using System.Runtime.InteropServices;

/// <summary>
/// WebGLBridge.cs — The communication layer between Unity and the React shell.
///
/// This script imports JavaScript functions from a .jslib plugin and exposes
/// C# methods that other Unity scripts call to "shout" to the browser.
///
/// How it works:
///   1. GenesisAltar.cs calls bridge.InitiateRitual() when the cat deposits all gems.
///   2. GemPickup.cs calls bridge.OnGemCollected(count) every time a gem is picked up.
///   3. The imported JS functions dispatch CustomEvents the React app listens to.
/// </summary>
public class WebGLBridge : MonoBehaviour
{
    // ─── Imported JavaScript functions from Plugins/WebGLBridge.jslib ────────

    [DllImport("__Internal")]
    private static extern void JS_TriggerPoapMint(string payload);

    [DllImport("__Internal")]
    private static extern void JS_SyncScore(int gemCount);

    // ─── Public API called by other Unity scripts ─────────────────────────────

    /// <summary>
    /// Call this when all gems are placed in the Genesis Altar.
    /// Triggers MetaMask prompt in the browser.
    /// </summary>
    public void InitiateRitual()
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        JS_TriggerPoapMint("level_complete");
#else
        Debug.Log("[WebGLBridge] LOCAL: TriggerPoapMint() — would open MetaMask in browser.");
#endif
    }

    /// <summary>
    /// Call this whenever the player picks up a gem.
    /// Updates the React Bento HUD's gem counter / spiritual energy bar.
    /// </summary>
    /// <param name="currentGemCount">Total gems held by the player right now.</param>
    public void OnGemCollected(int currentGemCount)
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        JS_SyncScore(currentGemCount);
#else
        Debug.Log($"[WebGLBridge] LOCAL: SyncScore({currentGemCount})");
#endif
    }
}

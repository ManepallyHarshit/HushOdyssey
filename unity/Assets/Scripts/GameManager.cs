using UnityEngine;

/// <summary>
/// GameManager.cs — Singleton that tracks gem count and overall level state.
/// Coordinates gem signals between GemPickup, GenesisAltar, and WebGLBridge.
/// </summary>
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Level Settings")]
    [SerializeField] private int totalGemsInLevel = 5;

    [Header("References")]
    [SerializeField] private WebGLBridge bridge;

    // ─── Direct React Bridge Import ────────
#if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void JS_SyncScore(int gemCount);
#endif

    private int _gemsCollected = 0;

    private void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
    }

    /// <summary>Called by GemPickup when a gem is collected.</summary>
    public void CollectGem(int value = 1)
    {
        _gemsCollected += value;
        _gemsCollected = Mathf.Clamp(_gemsCollected, 0, totalGemsInLevel);

        Debug.Log($"[GameManager] Gems: {_gemsCollected}/{totalGemsInLevel}");

        // DIRECT SYNC to the React Bento HUD
#if UNITY_WEBGL && !UNITY_EDITOR
        JS_SyncScore(_gemsCollected);
        Debug.Log($"[GameManager] Fired JS_SyncScore({_gemsCollected}) directly!");
#endif
    }

    /// <returns>True when all gems are in the player's possession.</returns>
    public bool AllGemsCollected() => _gemsCollected >= totalGemsInLevel;

    public int GemsCollected  => _gemsCollected;
    public int TotalGems      => totalGemsInLevel;
}

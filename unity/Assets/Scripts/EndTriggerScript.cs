using UnityEngine;

/// <summary>
/// EndTriggerScript.cs — This triggers the Genesis POAP Ritual!
/// I created this script because your Scene specifies it, but the file was missing.
/// </summary>
public class EndTriggerScript : MonoBehaviour
{
    // ─── Direct React Bridge Import ────────
#if UNITY_WEBGL && !UNITY_EDITOR
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void JS_TriggerPoapMint(string payload);
#endif

    [SerializeField] private GameObject blackScreen;
    private bool _triggered = false;

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (_triggered) return;

        // Ensure only the player triggers it
        if (!other.CompareTag("Player") && !other.gameObject.name.ToLower().Contains("cat")) return;

        // Ensure all gems are collected
        if (GameManager.Instance != null && !GameManager.Instance.AllGemsCollected())
        {
            Debug.Log("[EndTriggerScript] Player reached the end, but needs more gems!");
            return;
        }

        _triggered = true;
        Debug.Log("[EndTriggerScript] Ritual Triggered!");

        if (blackScreen != null)
        {
            blackScreen.SetActive(true);
        }

        // DIRECT SYNC to the React Website!
#if UNITY_WEBGL && !UNITY_EDITOR
        JS_TriggerPoapMint("level_complete");
        Debug.Log("[EndTriggerScript] DIRECT BRIDGE CALL SENT: JS_TriggerPoapMint");
#endif
    }
}

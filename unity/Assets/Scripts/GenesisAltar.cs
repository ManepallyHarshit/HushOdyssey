using UnityEngine;

/// <summary>
/// GenesisAltar.cs — Attach to the Altar prefab in the scene.
///
/// When the HushCat enters the altar zone AND all gems have been collected,
/// this script triggers the blockchain minting ritual via WebGLBridge.
/// </summary>
[RequireComponent(typeof(Collider2D))]
public class GenesisAltar : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private WebGLBridge bridge;

    [Header("Altar FX")]
    [SerializeField] private GameObject activatedEffect;
    [SerializeField] private GameObject idleEffect;

    private bool _ritualInitiated = false;

    private void Start()
    {
        // Altar starts in idle visual state
        if (idleEffect != null) idleEffect.SetActive(true);
        if (activatedEffect != null) activatedEffect.SetActive(false);

        if (bridge == null)
        {
            bridge = FindObjectOfType<WebGLBridge>();
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (_ritualInitiated) return;
        
        // DEBUG: See what is walking into the altar!
        Debug.Log($"[GenesisAltar] TRIGGER_ENTER by: {other.gameObject.name} (Tag: {other.gameObject.tag})");

        // Ritual requires Player tag OR name match "cat"
        bool isPlayer = other.CompareTag("Player") || other.gameObject.name.ToLower().Contains("cat");
        if (!isPlayer) return;

        // Check if all gems have been collected
        if (GameManager.Instance == null || !GameManager.Instance.AllGemsCollected())
        {
            int current = (GameManager.Instance != null) ? GameManager.Instance.GemsCollected : 0;
            int total = (GameManager.Instance != null) ? GameManager.Instance.TotalGems : 5;
            Debug.Log($"[GenesisAltar] Dormant: {current}/{total} gems collected.");
            return;
        }

        InitiateRitual();
    }

    private void InitiateRitual()
    {
        _ritualInitiated = true;

        Debug.Log("[GenesisAltar] All gems banked. RITUAL INITIATED.");

        // Switch VFX
        if (idleEffect != null) idleEffect.SetActive(false);
        if (activatedEffect != null) activatedEffect.SetActive(true);

        // Signal React to open MetaMask
        if (bridge != null)
        {
            bridge.InitiateRitual();
        }
        else
        {
            Debug.LogError("[GenesisAltar] WebGLBridge reference is missing! Assign it in the Inspector.");
        }
    }
}

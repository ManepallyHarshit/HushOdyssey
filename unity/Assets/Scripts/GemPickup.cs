using UnityEngine;

/// <summary>
/// GemPickup.cs — Attach to each Gem prefab in the scene.
///
/// When the HushCat enters the gem's trigger collider:
///   1. The gem is destroyed/hidden.
///   2. GameManager's gem counter is incremented.
///   3. The WebGLBridge signals React to update the Bento HUD.
/// </summary>
public class GemPickup : MonoBehaviour
{
    [Header("Gem Settings")]
    [SerializeField] private int gemValue = 1;

    [Header("VFX (optional)")]
    [SerializeField] private GameObject pickupEffect;

    private void OnTriggerEnter2D(Collider2D other)
    {
        // DEBUG: Log ANY object that hits this gem's trigger
        Debug.Log($"[GemPickup] TRIGGER_ENTER by: {other.gameObject.name} (Tag: {other.gameObject.tag})");

        // Only the player can collect gems
        if (!other.CompareTag("Player") && !other.gameObject.name.ToLower().Contains("cat")) 
        {
            return;
        }

        // Notify GameManager
        if (GameManager.Instance != null)
        {
            GameManager.Instance.CollectGem(gemValue);
        }
        else
        {
            Debug.LogError("[GemPickup] GameManager Instance is NULL! Make sure GameManager exists in the scene.");
        }

        // Spawn optional visual effect
        if (pickupEffect != null)
        {
            Instantiate(pickupEffect, transform.position, Quaternion.identity);
        }

        // Destroy this gem GameObject
        Debug.Log($"[GemPickup] SUCCESS: Gem collected by {other.gameObject.name}!");
        Destroy(gameObject);
    }
}

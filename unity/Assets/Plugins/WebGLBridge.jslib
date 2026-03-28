mergeInto(LibraryManager.library, {
  /**
   * Called from WebGLBridge.cs → InitiateRitual()
   * Dispatches a CustomEvent that the React useUnityBridge hook listens for.
   */
  JS_TriggerPoapMint: function(payloadPtr) {
    var payload = UTF8ToString(payloadPtr);
    console.log("[WebGLBridge.jslib] TriggerPoapMint received:", payload);
    window.dispatchEvent(new CustomEvent("TriggerPoapMint", { detail: payload }));
  },

  /**
   * Called from WebGLBridge.cs → OnGemCollected()
   * Dispatches a CustomEvent with the current gem count for HUD updates.
   */
  JS_SyncScore: function(gemCount) {
    console.log("[WebGLBridge.jslib] SyncScore received:", gemCount);
    window.dispatchEvent(new CustomEvent("SyncScore", { detail: gemCount }));
  }
});

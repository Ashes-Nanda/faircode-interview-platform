
// ShadowSight DOM Monitoring Script

// 🔧 Utility to check for suspicious overlay-like behavior
export function isSuspiciousOverlay(node: Element): boolean {
  const style = window.getComputedStyle(node);
  const zIndex = parseInt(style.zIndex) || 0;

  return (
    (node.tagName === "DIV" || node.tagName === "IFRAME") &&
    (style.opacity < "0.3" || style.visibility === "hidden" || style.display === "none") &&
    zIndex > 10
  );
}

// 🔧 Utility to detect hidden, spoofed input editors
export function isSuspiciousEditor(node: Element): boolean {
  return (
    node.hasAttribute("contenteditable") &&
    node.clientHeight > 50 &&
    window.getComputedStyle(node).opacity < "0.8"
  );
}

// 📥 Temporary Local Logger (no Firebase)
export function logRedFlag(type: string, data: string) {
  const payload = {
    type,
    data,
    timestamp: new Date().toISOString(),
    severity: getSeverity(type),
  };

  console.log("[ShadowSight] Local Flag Logged:", payload);
  return payload;
}

// 📊 Severity classifier
function getSeverity(type: string): string {
  const levels: Record<string, string> = {
    "extension-script": "medium",
    "iframe": "high",
    "overlay": "high",
    "contenteditable": "medium"
  };
  return levels[type] || "low";
}

// Initialize the DOM observer
let observer: MutationObserver | null = null;

export function startDOMMonitoring(): void {
  if (observer) {
    // Already monitoring
    return;
  }

  // 🧠 Monitor DOM Mutations for suspicious nodes
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        // 🚨 Detect injected scripts from extensions
        if (
          node.tagName === "SCRIPT" &&
          (node.getAttribute("src")?.startsWith("chrome-extension://") ||
           node.getAttribute("src")?.startsWith("moz-extension://"))
        ) {
          const src = node.getAttribute("src") || "";
          console.warn("[ShadowSight] Extension script injected:", src);
          logRedFlag("extension-script", src);
        }

        // 🚨 Detect invisible overlays or iframe wrappers
        if (isSuspiciousOverlay(node)) {
          console.warn("[ShadowSight] Suspicious overlay detected:", node);
          logRedFlag("overlay", node.outerHTML);
        }

        // 🚨 Detect fake input fields using contenteditable
        if (isSuspiciousEditor(node)) {
          console.warn("[ShadowSight] Suspicious contenteditable element:", node);
          logRedFlag("contenteditable", node.outerHTML);
        }

        // 🚨 Detect injected iframes
        if (node.tagName === "IFRAME") {
          const src = node.getAttribute("src") || node.outerHTML;
          console.warn("[ShadowSight] Iframe injected:", src);
          logRedFlag("iframe", src);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("[ShadowSight] DOM Monitoring Activated");
}

export function stopDOMMonitoring(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log("[ShadowSight] DOM Monitoring Deactivated");
  }
}

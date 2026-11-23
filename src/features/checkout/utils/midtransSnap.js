const MIDTRANS_SANDBOX_SNAP_URL =
  "https://app.sandbox.midtrans.com/snap/snap.js";

let snapScriptPromise = null;

/**
 * Ensure Midtrans Snap.js is loaded when VITE_MIDTRANS_CLIENT_KEY is configured.
 * @returns {Promise<boolean>}
 */
export function ensureMidtransSnapLoaded() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.snap && typeof window.snap.pay === "function") {
    return Promise.resolve(true);
  }

  const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
  if (!clientKey) {
    return Promise.resolve(false);
  }

  if (snapScriptPromise) {
    return snapScriptPromise;
  }

  snapScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector(
      `script[src="${MIDTRANS_SANDBOX_SNAP_URL}"]`,
    );

    if (existingScript) {
      if (window.snap && typeof window.snap.pay === "function") {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => resolve(Boolean(window.snap)));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = MIDTRANS_SANDBOX_SNAP_URL;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    script.onload = () => resolve(Boolean(window.snap));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return snapScriptPromise;
}

/**
 * Open Midtrans Snap payment popup or fallback to redirectUrl.
 * @param {Object} params
 * @param {string} params.snapToken
 * @param {string} [params.redirectUrl]
 * @param {Function} [params.onSuccess]
 * @param {Function} [params.onPending]
 * @param {Function} [params.onError]
 * @param {Function} [params.onClose]
 * @returns {Promise<"snap" | "redirect" | "unavailable">}
 */
export async function openMidtransSnap({
  snapToken,
  redirectUrl,
  onSuccess,
  onPending,
  onError,
  onClose,
}) {
  const isSnapReady = await ensureMidtransSnapLoaded();

  if (isSnapReady && snapToken && window.snap?.pay) {
    window.snap.pay(snapToken, {
      onSuccess,
      onPending,
      onError,
      onClose,
    });
    return "snap";
  }

  if (redirectUrl) {
    window.location.assign(redirectUrl);
    return "redirect";
  }

  return "unavailable";
}

let lastSentText = "";

document.addEventListener("mouseup", () => {
  // Chrome context safety guard
  if (
    typeof chrome === "undefined" ||
    !chrome.runtime ||
    !chrome.runtime.sendMessage
  ) {
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;

  const text = selection.toString().trim();

  // ---- Intent guards ----
  if (!text) return;
  if (text.length < 15) return;          // ignore tiny selections
  if (text === lastSentText) return;     // avoid duplicates

  lastSentText = text;

  try {
    chrome.runtime.sendMessage({
      type: "TEXT_SELECTED",
      payload: text,
    });
  } catch {
    // Extension reloaded / context invalidated
    // Safe to ignore during dev
  }
});
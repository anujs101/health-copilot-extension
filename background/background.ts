// -----------------------------
// In-memory state
// -----------------------------
let lastSelection = "";

// -----------------------------
// 1️⃣ Create context menu ON INSTALL
// -----------------------------
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ASK_HEALTH_COPILOT",
    title: "Ask Health Copilot",
    contexts: ["selection", "image"],
  });
});

// -----------------------------
// 2️⃣ Listen for messages from content script / side panel
// -----------------------------
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // Text selected on page (quiet signal)
  if (msg.type === "TEXT_SELECTED") {
    lastSelection = msg.payload;
    console.log("📌 Selected:", lastSelection);
  }

  // Side panel asking for latest text
  if (msg.type === "GET_SELECTION") {
    sendResponse(lastSelection);
  }
});

// -----------------------------
// 3️⃣ Handle RIGHT-CLICK → Ask Health Copilot
// -----------------------------
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  // Only handle our menu item
  if (info.menuItemId !== "ASK_HEALTH_COPILOT") return;

  // ---- TEXT INTENT ----
  if (info.selectionText) {
    lastSelection = info.selectionText;
    console.log("📝 Text intent:", lastSelection);

    // Clear any previous image intent
    chrome.storage.session.remove("lastImageUrl");
  }

  // ---- IMAGE INTENT ----
  if (info.srcUrl) {
    console.log("🖼 Image intent:", info.srcUrl);

    // Clear text intent
    lastSelection = "";

    // Store image URL for side panel
    chrome.storage.session.set({
      lastImageUrl: info.srcUrl,
    });
  }

  // ---- Explicit user intent → open side panel
  chrome.sidePanel.open({ tabId: tab.id });
});
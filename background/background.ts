let lastSelection = "";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "TEXT_SELECTED") {
    lastSelection = msg.payload;
    console.log("📌 Selected:", lastSelection);
  }

  if (msg.type === "GET_SELECTION") {
    sendResponse(lastSelection);
  }
});
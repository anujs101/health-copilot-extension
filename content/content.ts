let lastSentText = "";

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  if (!selection) return;

  const text = selection.toString().trim();

  if (!text) return;
  if (text.length < 15) return;
  if (text === lastSentText) return;

  lastSentText = text;

  try {
    chrome.runtime.sendMessage({
      type: "TEXT_SELECTED",
      payload: text,
    });
  } catch (err) {
    // Extension was reloaded – safe to ignore
    console.debug("Extension context invalidated");
  }
});
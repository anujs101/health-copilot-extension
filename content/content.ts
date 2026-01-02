document.addEventListener("mouseup", () => {
  const text = window.getSelection()?.toString().trim();
  if (!text) return;

  chrome.runtime.sendMessage({
    type: "TEXT_SELECTED",
    payload: text
  });
});
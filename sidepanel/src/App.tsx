import { useEffect, useState } from "react";

export default function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    // initial fetch
    chrome.runtime.sendMessage(
      { type: "GET_SELECTION" },
      (res) => setText(res || "")
    );

    // live updates
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "SELECTION_UPDATED") {
        setText(msg.payload);
      }
    });
  }, []);

  return (
    <div className="p-4 text-sm">
      <h2 className="text-lg font-semibold mb-2">
        Health Copilot
      </h2>

      {text ? (
        <div className="bg-gray-100 p-3 rounded">
          <p className="font-medium mb-1">Selected text</p>
          <p>{text}</p>
        </div>
      ) : (
        <p className="text-gray-400">
          Highlight ingredients on any page
        </p>
      )}
    </div>
  );
}
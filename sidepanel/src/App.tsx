import { useEffect, useState } from "react";

export default function App() {
  const [text, setText] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: "GET_SELECTION" },
      (res) => setText(res || "")
    );
  }, []);

  return (
    <div className="p-4 text-sm">
      <h2 className="text-lg font-semibold mb-2">Health Copilot</h2>

      {text ? (
        <p className="bg-gray-100 p-2 rounded">{text}</p>
      ) : (
        <p className="text-gray-400">
          Highlight ingredients on any page
        </p>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";

type Mode = "idle" | "text" | "image";

export default function App() {
  const [mode, setMode] = useState<Mode>("idle");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  async function callHealthCopilot(payload: string) {
  console.log("🚀 Calling Health Copilot with:", payload);
  setLoading(true);

  try {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: payload,
        conversationId: "chrome-session",
      }),
    });

    console.log("📡 Response status:", res.status);

    const data = await res.json();
    console.log("🧠 AI response:", data);

    setAiResponse(data.response);
  } catch (err) {
    console.error("❌ Failed to call Health Copilot", err);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    // ---- TEXT INTENT ----
    chrome.runtime.sendMessage(
      { type: "GET_SELECTION" },
      (res) => {
        if (typeof res === "string" && res.length > 0) {
          setText(res);
          setMode("text");
          callHealthCopilot(res);
        }
      }
    );

    // ---- IMAGE INTENT ----
    chrome.storage.session.get(
      ["lastImageUrl"],
      (res: { lastImageUrl?: string }) => {
        if (typeof res.lastImageUrl === "string") {
          setImageUrl(res.lastImageUrl);
          setMode("image");
          callHealthCopilot(
            `User wants health insight about this product image: ${res.lastImageUrl}`
          );
        }
      }
    );
  }, []);

  return (
    <div className="p-4 text-sm space-y-4">
      <h2 className="text-lg font-semibold">
        Health Copilot
      </h2>

      {mode === "idle" && (
        <p className="text-gray-400">
          Select ingredients or right-click a product image, then choose
          <span className="font-medium"> “Ask Health Copilot”</span>.
        </p>
      )}

      {mode === "text" && (
        <div className="bg-gray-100 p-3 rounded space-y-2">
          <p className="font-medium text-gray-700">
            Selected ingredients
          </p>
          <p className="text-gray-800">{text}</p>
        </div>
      )}

      {mode === "image" && (
        <div className="space-y-2">
          <p className="font-medium text-gray-700">
            Selected product image
          </p>
          <img
            src={imageUrl}
            alt="Selected product"
            className="rounded border max-h-64 object-contain"
          />
        </div>
      )}

      {loading && (
        <p className="text-gray-400">
          Thinking about this product…
        </p>
      )}

      {aiResponse && (
        <pre className="text-xs bg-black text-green-400 p-2 rounded overflow-auto">
          {JSON.stringify(aiResponse, null, 2)}
        </pre>
      )}
    </div>
  );
}
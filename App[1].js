import { useState, useEffect } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);

  const generateVideo = async () => {
    setLoading(true);
    setVideoUrl("");

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setJobId(data.id);
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:5000/status/${jobId}`);
      const data = await res.json();

      if (data.status === "succeeded") {
        setVideoUrl(data.video);
        setLoading(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Video Generator</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt"
      />

      <button onClick={generateVideo}>Generate</button>

      {loading && <p>Generating...</p>}

      {videoUrl && <video src={videoUrl} controls width="400" />}
    </div>
  );
}

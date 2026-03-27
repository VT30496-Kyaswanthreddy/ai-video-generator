import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "MODEL_VERSION_ID",
      input: { prompt }
    })
  });

  const data = await response.json();
  res.json({ id: data.id });
});

app.get("/status/:id", async (req, res) => {
  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${req.params.id}`,
    {
      headers: {
        "Authorization": "Token YOUR_API_KEY"
      }
    }
  );

  const data = await response.json();

  res.json({
    status: data.status,
    video: data.output ? data.output[0] : null
  });
});

app.listen(5000, () => console.log("Server running"));

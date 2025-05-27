import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

// API route for token generation (MUST be before Vite middleware)
app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Configure Vite middleware for React client
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "spa", // Single Page Application mode
});
app.use(vite.middlewares);

// Serve static files and SPA fallback (MUST be last)
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./client" });
});

app.listen(port, () => {
  console.log(`Express server running on *:${port}`);
}); 
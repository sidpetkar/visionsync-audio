import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

// API route for token generation (MUST be before static middleware)
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

// Serve static files from dist directory in production, client directory in development
const staticDir = process.env.NODE_ENV === 'production' ? 'dist' : 'client';
app.use(express.static(path.join(__dirname, staticDir)));

// SPA fallback - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, staticDir, "index.html"));
});

// Start server if not in Vercel environment
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Express server running on *:${port}`);
  });
}

// Export for Vercel
export default app; 
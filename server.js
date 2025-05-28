import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

// Check if we're in development mode (via --dev flag or NODE_ENV)
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
const isVercel = !!process.env.VERCEL;

// Debug logging
console.log("Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  isDev: isDev,
  argv: process.argv,
  __dirname: __dirname
});

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

// Serve static files from appropriate directory
const staticDir = isDev ? 'client' : 'dist';
console.log("Static directory:", staticDir);
console.log("Full static path:", path.join(__dirname, staticDir));

app.use(express.static(path.join(__dirname, staticDir)));

// SPA fallback - serve index.html for all other routes
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, staticDir, "index.html");
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath);
});

// Start server if not in Vercel environment
if (!isVercel) {
  app.listen(port, () => {
    console.log(`Express server running on *:${port}`);
    console.log(`Mode: ${isDev ? 'Development' : 'Production'}`);
  });
}

// Export for Vercel
export default app; 
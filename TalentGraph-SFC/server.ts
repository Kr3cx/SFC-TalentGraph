import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock Market Intelligence Data
  app.get("/api/market-intelligence", (req, res) => {
    res.json({
      trends: [
        { month: "Jan", ai: 45, cloud: 30, devops: 25 },
        { month: "Feb", ai: 52, cloud: 32, devops: 28 },
        { month: "Mar", ai: 61, cloud: 35, devops: 30 },
        { month: "Apr", ai: 75, cloud: 40, devops: 35 },
      ],
      hotSkills: [
        { name: "Prompt Engineering", growth: 84 },
        { name: "LLM Fine-tuning", growth: 56 },
        { name: "MLOps", growth: 42 },
      ],
      salaries: [
        { role: "AI Architect", min: 180000, max: 250000 },
        { role: "Cloud Engineer", min: 120000, max: 180000 },
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

require("dotenv").config();
const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const cors       = require("cors");
const axios      = require("axios");

const { tickMetrics, getSnapshot } = require("./metrics");
const { checkAlerts }              = require("./alertEngine");

const app    = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost",
  "http://localhost:80",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://13.234.238.85",
  "http://13.201.124.44",
  "https://nexus-pulse-six.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// ── REST API endpoints ─────────────────────────────────────────────────────

app.get("/api/servers", (req, res) => {
  res.json(getSnapshot());
});

app.get("/api/alerts", (req, res) => {
  const servers = getSnapshot();
  res.json(checkAlerts(servers));
});

app.post("/api/analyze", async (req, res) => {
  const { servers, alerts } = req.body;

  const serverSummary = servers.map(s =>
    `${s.name} (${s.role}): CPU=${Math.round(s.cpu)}% RAM=${Math.round(s.ram)}% Disk=${Math.round(s.disk)}% Net=${Math.round(s.net)}MB/s`
  ).join("\n");

  const alertSummary = alerts.slice(0, 8)
    .map(a => `[${a.severity.toUpperCase()}] ${a.server} — ${a.message}`)
    .join("\n") || "No active alerts";

  const prompt = `You are a senior DevOps SRE engineer analyzing a live server monitoring dashboard for NexusPulse.

Current Server Metrics:
${serverSummary}

Active Alerts:
${alertSummary}

Provide a concise actionable analysis in exactly 5 bullet points (use • prefix). Cover:
1. Most critical issue and immediate action needed
2. Root cause hypothesis for the top alert
3. Scaling or optimization recommendation
4. Predicted risk if left unaddressed (with timeframe)
5. One proactive long-term improvement

Use DevOps terminology. Be specific. Start each point with an emoji + **Bold Category:**.`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );
    res.json({ analysis: response.data.choices[0].message.content });
  } catch (err) {
    console.error("Groq API error:", err.message);
    console.error("Groq API details:", err.response?.data);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

// ── WebSocket — real-time metric stream ────────────────────────────────────

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  const snap = getSnapshot();
  socket.emit("metrics", { servers: snap, alerts: checkAlerts(snap) });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ── Tick every 2 seconds ───────────────────────────────────────────────────

setInterval(() => {
  tickMetrics();
  const snap = getSnapshot();
  io.emit("metrics", { servers: snap, alerts: checkAlerts(snap) });
}, 2000);

// ── Start server ───────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ NexusPulse backend running on http://localhost:${PORT}`);
});
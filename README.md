# NexusPulse - Smart Server Monitoring & Alert System

Real-time server monitoring dashboard with AI-powered root cause analysis.

## Tech Stack
- **Frontend:** React 18, Vite, Recharts, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO, Axios
- **AI:** Claude API (claude-sonnet-4) for intelligent analysis
- **Real-time:** WebSocket-based live metric streaming

## Features
- Live metrics for CPU, RAM, Disk, Network across 4 servers
- Threshold-based alert engine (Warning >70%, Critical >85%)
- AI-powered root cause analysis via Claude API
- System log stream with severity tagging
- 99.5%+ SLA uptime tracking

## Run Locally
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

## Architecture Overview

```
nexusPulse/
|-- backend/           <-- Node.js + Express + Socket.IO
|   |-- server.js      <-- Main server (metrics, alerts, AI endpoint)
|   |-- metrics.js     <-- Metric simulation engine
|   |-- alertEngine.js <-- Threshold detection logic
|   `-- package.json
|
|-- frontend/          <-- React + Vite
|   |-- src/
|   |   |-- App.jsx         <-- Root component
|   |   |-- components/
|   |   |   |-- Header.jsx
|   |   |   |-- ServerCard.jsx
|   |   |   |-- MetricChart.jsx
|   |   |   |-- AlertPanel.jsx
|   |   |   |-- LogViewer.jsx
|   |   |   `-- AIAnalysis.jsx
|   |   |-- hooks/
|   |   |   `-- useSocket.js   <-- WebSocket real-time hook
|   |   `-- api/
|   |       `-- client.js      <-- Axios API client
|   `-- package.json
|
`-- README.md
```

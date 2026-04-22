// Metric simulation engine for NexusPulse
// In a real system, replace rand() values with actual OS readings
// using the 'systeminformation' npm package

const SERVERS = [
  { id: "srv-01", name: "prod-web-01",    role: "Web Server",   region: "us-east-1"  },
  { id: "srv-02", name: "prod-db-01",     role: "Database",     region: "us-east-1"  },
  { id: "srv-03", name: "prod-cache-01",  role: "Cache/Redis",  region: "eu-west-2"  },
  { id: "srv-04", name: "prod-worker-01", role: "Worker Queue", region: "ap-south-1" },
];

// Track current state of each server
const state = {};
SERVERS.forEach(s => {
  state[s.id] = { cpu: 40, ram: 55, disk: 50, net: 200, uptime: 99.98 };
});

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function rand(lo, hi)      { return lo + Math.random() * (hi - lo); }

// Simulate realistic metric drift (random walk pattern)
function tickMetrics() {
  SERVERS.forEach(s => {
    const m = state[s.id];
    m.cpu  = clamp(m.cpu  + rand(-6, 6),   5,  99);
    m.ram  = clamp(m.ram  + rand(-3, 4),   20, 99);
    m.disk = clamp(m.disk + rand(-0.2, 0.3), 20, 99);
    m.net  = clamp(m.net  + rand(-50, 50), 10, 900);
  });
}

function getSnapshot() {
  return SERVERS.map(s => ({
    ...s,
    ...state[s.id],
    timestamp: new Date().toISOString(),
  }));
}

module.exports = { tickMetrics, getSnapshot };

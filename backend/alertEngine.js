// Alert threshold engine for NexusPulse
// Follows standard SRE on-call thresholds

const THRESHOLDS = {
  cpu:  { warning: 70, critical: 85 },
  ram:  { warning: 70, critical: 85 },
  disk: { warning: 75, critical: 85 },
};

let alertIdCounter = 1;

function checkAlerts(servers) {
  const alerts = [];

  servers.forEach(server => {
    Object.entries(THRESHOLDS).forEach(([metric, levels]) => {
      const value = server[metric];
      let severity = null;

      if (value >= levels.critical) severity = "critical";
      else if (value >= levels.warning) severity = "warning";

      if (severity) {
        alerts.push({
          id:       alertIdCounter++,
          severity,
          serverId: server.id,
          server:   server.name,
          metric:   metric.toUpperCase(),
          value:    Math.round(value),
          message:  `${metric.toUpperCase()} ${severity} on ${server.name}: ${Math.round(value)}%`,
          time:     new Date().toLocaleTimeString("en-US", { hour12: false }),
        });
      }
    });
  });

  return alerts;
}

module.exports = { checkAlerts };

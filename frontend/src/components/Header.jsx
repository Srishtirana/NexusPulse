const C = {
  bg:"#080C14", panel:"#0D1525", border:"#1A2740",
  accent:"#00D9FF", green:"#00FF9C", yellow:"#FFD60A",
  red:"#FF3B5C", dim:"#5A7A9A"
};

function healthColor(v) {
  if (v > 85) return C.red;
  if (v > 70) return C.yellow;
  return C.green;
}

export default function Header({ servers, alerts, connected }) {
  const critCount = alerts.filter(a => a.severity === "critical").length;
  const warnCount = alerts.filter(a => a.severity === "warning").length;
  const avgLoad = servers.length
    ? servers.reduce((s, sv) => s + (sv.cpu + sv.ram + sv.disk) / 3, 0) / servers.length
    : 0;
  const sysHealth = Math.round(100 - avgLoad);

  return (
    <header style={{
      borderBottom:`1px solid ${C.border}`,
      padding:"0 28px",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      height:58,
      background:`${C.panel}DD`,
      backdropFilter:"blur(12px)",
      position:"sticky",
      top:0,
      zIndex:100
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{
          width:34, height:34, borderRadius:9,
          background:`linear-gradient(135deg,${C.accent},#0060FF)`,
          display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:17
        }}>⬡</div>
        <div>
          <div style={{
            fontWeight:800, fontSize:17, letterSpacing:1,
            fontFamily:"system-ui", color:"#fff"
          }}>
            NEXUS<span style={{ color:C.accent }}>PULSE</span>
          </div>
          <div style={{
            fontFamily:"'Space Mono',monospace",
            fontSize:9, color:C.dim, letterSpacing:2
          }}>
            SMART SERVER MONITORING
          </div>
        </div>
      </div>

      {/* Right side stats */}
      <div style={{ display:"flex", alignItems:"center", gap:18 }}>

        {/* System Health */}
        <div style={{ textAlign:"center" }}>
          <div style={{
            fontFamily:"'Space Mono',monospace",
            fontSize:22, fontWeight:700,
            color:healthColor(100 - sysHealth)
          }}>
            {sysHealth}<span style={{ fontSize:11 }}>%</span>
          </div>
          <div style={{ fontSize:9, color:C.dim, letterSpacing:1 }}>SYS HEALTH</div>
        </div>

        <div style={{ width:1, height:34, background:C.border }} />

        {/* Alert badges */}
        <div style={{ display:"flex", gap:7 }}>
          <span style={{
            padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
            background:`${C.red}22`, color:C.red, border:`1px solid ${C.red}44`
          }}>
            {critCount} CRIT
          </span>
          <span style={{
            padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
            background:`${C.yellow}22`, color:C.yellow, border:`1px solid ${C.yellow}44`
          }}>
            {warnCount} WARN
          </span>
        </div>

        <div style={{ width:1, height:34, background:C.border }} />

        {/* Live indicator */}
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <div style={{
            width:8, height:8, borderRadius:"50%",
            background: connected ? C.green : C.red,
            boxShadow: connected ? `0 0 8px ${C.green}` : `0 0 8px ${C.red}`
          }} />
          <span style={{
            fontFamily:"'Space Mono',monospace", fontSize:11,
            color: connected ? C.green : C.red
          }}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

      </div>
    </header>
  );
}
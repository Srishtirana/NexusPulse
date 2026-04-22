import { useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { analyzeWithAI } from "./api/client";
import Header from "./components/Header";
import "./App.css";

const C = { bg:"#080C14", panel:"#0D1525", border:"#1A2740",
  accent:"#00D9FF", green:"#00FF9C", yellow:"#FFD60A", red:"#FF3B5C", dim:"#5A7A9A" };

function healthColor(v) {
  if (v > 85) return C.red;
  if (v > 70) return C.yellow;
  return C.green;
}

function ServerCard({ server }) {
  return (
    <div style={{ 
      background:C.panel, border:`1px solid ${C.border}`, borderRadius:12,
      padding:16, marginBottom:12, position:"relative", overflow:"hidden"
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:"#fff" }}>{server.name}</div>
          <div style={{ fontSize:11, color:C.dim }}>{server.role} • {server.region}</div>
        </div>
        <div style={{ 
          width:8, height:8, borderRadius:"50%", 
          background:healthColor(server.cpu),
          boxShadow:`0 0 12px ${healthColor(server.cpu)}44`
        }} />
      </div>
      
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[
          { label:"CPU", value:server.cpu, unit:"%" },
          { label:"RAM", value:server.ram, unit:"%" },
          { label:"Disk", value:server.disk, unit:"%" },
          { label:"Net", value:server.net, unit:"MB/s" }
        ].map(metric => (
          <div key={metric.label}>
            <div style={{ fontSize:10, color:C.dim, marginBottom:4 }}>{metric.label}</div>
            <div style={{ 
              fontSize:18, fontWeight:700, color:healthColor(metric.value),
              fontFamily:"'Space Mono',monospace"
            }}>
              {Math.round(metric.value)}<span style={{ fontSize:10 }}>{metric.unit}</span>
            </div>
            <div style={{ 
              height:3, background:C.border, borderRadius:2, marginTop:4, overflow:"hidden"
            }}>
              <div style={{
                width:`${metric.value}%`, height:"100%", 
                background:healthColor(metric.value),
                transition:"width 0.3s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertPanel({ alerts }) {
  return (
    <div style={{ 
      background:C.panel, border:`1px solid ${C.border}`, borderRadius:12,
      padding:16, marginBottom:12
    }}>
      <h3 style={{ color:"#fff", fontSize:14, marginBottom:12, fontWeight:700 }}>Active Alerts</h3>
      {alerts.length === 0 ? (
        <div style={{ color:C.green, fontSize:12, fontFamily:"'Space Mono',monospace" }}>
          ✓ No active alerts
        </div>
      ) : (
        alerts.map(alert => (
          <div key={alert.id} style={{
            padding:8, borderRadius:6, marginBottom:6,
            background:alert.severity === "critical" ? `${C.red}22` : `${C.yellow}22`,
            borderLeft:`3px solid ${alert.severity === "critical" ? C.red : C.yellow}`
          }}>
            <div style={{ 
              fontSize:11, fontWeight:700, 
              color:alert.severity === "critical" ? C.red : C.yellow,
              textTransform:"uppercase"
            }}>
              {alert.severity} • {alert.time}
            </div>
            <div style={{ fontSize:12, color:"#fff", marginTop:2 }}>{alert.message}</div>
          </div>
        ))
      )}
    </div>
  );
}

function AIAnalysis({ servers, alerts }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeWithAI(servers, alerts);
      setAnalysis(result);
    } catch (err) {
      setAnalysis("❌ Analysis failed. Check API key.");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      background:C.panel, border:`1px solid ${C.border}`, borderRadius:12,
      padding:16
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <h3 style={{ color:"#fff", fontSize:14, fontWeight:700 }}>AI Analysis</h3>
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            padding:"6px 12px", background:C.accent, color:"#000", border:"none",
            borderRadius:6, fontSize:11, fontWeight:700, cursor:loading?"not-allowed":"pointer"
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      
      {analysis && (
        <div style={{
          fontSize:11, lineHeight:1.6, color:C.dim,
          whiteSpace:"pre-line", fontFamily:"'Space Mono',monospace"
        }}>
          {analysis}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { servers, alerts, connected } = useSocket();

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:"#fff", fontFamily:"system-ui" }}>
      <Header servers={servers} alerts={alerts} connected={connected} />
      
      <main style={{ padding:20, maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          <div>
            <h2 style={{ fontSize:16, color:"#fff", marginBottom:16, fontWeight:700 }}>Servers</h2>
            {servers.map(server => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
          
          <div>
            <AlertPanel alerts={alerts} />
            <AIAnalysis servers={servers} alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "http://13.234.238.85:5000";

let socket;

export function useSocket() {
  const [servers, setServers] = useState([]);
  const [alerts, setAlerts]   = useState([]);
  const [connected, setConn]  = useState(false);

  useEffect(() => {
    socket = io(BACKEND_URL);

    socket.on("connect",    () => setConn(true));
    socket.on("disconnect", () => setConn(false));

    socket.on("metrics", ({ servers, alerts }) => {
      setServers(servers);
      setAlerts(alerts);
    });

    return () => socket.disconnect();
  }, []);

  return { servers, alerts, connected };
}
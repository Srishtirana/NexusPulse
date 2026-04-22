import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const api = axios.create({ baseURL: "https://nexuspulse-oxrc.onrender.com/api" });
let socket;

export function useSocket() {
  const [servers, setServers]   = useState([]);
  const [alerts, setAlerts]     = useState([]);
  const [connected, setConn]    = useState(false);

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

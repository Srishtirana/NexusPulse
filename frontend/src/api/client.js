import axios from "axios";

const api = axios.create({ baseURL: "https://nexuspulse-api.onrender.com/api" });

export async function analyzeWithAI(servers, alerts) {
  const { data } = await api.post("/analyze", { servers, alerts });
  return data.analysis;
}

export default api;

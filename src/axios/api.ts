import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // json-server default port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

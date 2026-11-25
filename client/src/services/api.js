
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getItems = (response) => {
  const result = response.data;
  if (Array.isArray(result)) return result;
  return result?.data || result?.events || result?.clubs || result?.registrations || [];
};

export default api;

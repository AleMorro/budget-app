import axios from "axios";

/**
 * In dev CRA inoltra /api → backend (package.json proxy); i cookie restano same-origin.
 * In produzione imposta REACT_APP_API_URL se frontend e API sono su host diversi.
 */
const API_BASE =
   process.env.REACT_APP_API_URL ||
   (process.env.NODE_ENV === "production" ? "/api/" : "/api/");

/** Client axios con cookie di sessione (Passport) */
const api = axios.create({
   baseURL: API_BASE,
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
});

export { api, API_BASE };
export default api;

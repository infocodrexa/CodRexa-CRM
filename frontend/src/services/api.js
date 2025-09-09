import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // Backend ka URL
//   withCredentials: true,
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // should be http://localhost:5000/api
  withCredentials: true
});
export default API;

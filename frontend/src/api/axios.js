import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let accessToken = null;
export const setAccessToken = (t) => (accessToken = t);
export const getAccessToken = () => accessToken;

api.interceptors.request.use(cfg => {
  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;
  return cfg;
});

// response interceptor for 401 -> try refresh
let isRefreshing = false, queue = [];
const processQueue = (err, token = null) => {
  queue.forEach(p => (err ? p.reject(err) : p.resolve(token)));
  queue = [];
};

api.interceptors.response.use(r => r, async err => {
  const original = err.config;
  if (err.response && err.response.status === 401 && !original._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }
    original._retry = true;
    isRefreshing = true;
    try {
      const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
      const newToken = res.data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      processQueue(e, null);
      return Promise.reject(e);
    } finally { isRefreshing = false; }
  }
  return Promise.reject(err);
});

export default api;

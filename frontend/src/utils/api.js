// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// // });

// // // 🔒 Attach token automatically on every request
// // // 🔒 Attach token automatically
// // API.interceptors.request.use((req) => {
// //   const token = localStorage.getItem("token");
// //   if (token) {
// //     req.headers = req.headers || {};
// //     req.headers.Authorization = `Bearer ${token}`;
// //   }
// //   return req;
// // });

// // // ==============================
// // // 🌟 API functions
// // // ==============================

// // // Get all notifications
// // export const getNotifications = async () => {
// //   const res = await API.get("/notifications");
// //   return res.data;
// // };

// // // Mark notification as read
// // export const markNotificationAsRead = async (id) => {
// //   const res = await API.put(`/notifications/${id}/read`);
// //   return res.data;
// // };

// // export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
// });

// // State to manage the token refreshing process
// let isRefreshing = false;
// let failedQueue = [];

// // Function to process the queue of failed requests
// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // ----------------------------------------------------------------------
// // 1. REQUEST INTERCEPTOR: Attaches the Access Token
// // ----------------------------------------------------------------------
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");

//   req.headers = req.headers || {};

//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   } else {
//     // Critical Fix: Remove stale header if token is missing
//     delete req.headers.Authorization;
//   }
//   return req;
// });

// // ----------------------------------------------------------------------
// // 2. RESPONSE INTERCEPTOR: Handles Token Expiration (401)
// // ----------------------------------------------------------------------
// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const status = error.response?.status;

//     // Check if the error is a 401 and we haven't already marked this request for retry
//     if (
//       status === 401 &&
//       originalRequest.url !== `${API.defaults.baseURL}/refresh` &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       // If refresh is NOT in progress, start it
//       if (!isRefreshing) {
//         isRefreshing = true;

//         // --- 🛑 Start Token Refresh Logic 🛑 ---

//         const refreshToken = localStorage.getItem("refreshToken"); // Assuming you save the long-lived token as 'refreshToken'

//         // If the refresh token itself is missing, force logout
//         if (!refreshToken) {
//           // You need to implement your full logout logic here (e.g., redirect to login)
//           // window.location = '/login';
//           return Promise.reject(error);
//         }

//         // Create a promise for the current failed request
//         const retryPromise = new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         });

//         try {
//           // Call the /refresh endpoint (Note: Use plain axios or an un-intercepted instance if needed)
//           const refreshResponse = await axios.post(
//             `${API.defaults.baseURL}/refresh`,
//             { refreshToken: refreshToken } // Send the token in the body
//           );

//           const newAccessToken = refreshResponse.data.token;
//           const newRefreshToken =
//             refreshResponse.data.refreshToken || refreshToken;

//           // Save the new tokens
//           localStorage.setItem("token", newAccessToken);
//           localStorage.setItem("refreshToken", newRefreshToken);

//           // Update the Authorization header for all future requests
//           API.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${newAccessToken}`;

//           // Process the queue of failed requests with the new token
//           processQueue(null, newAccessToken);
//           isRefreshing = false;

//           // Return the original request with the new token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return API(originalRequest);
//         } catch (refreshError) {
//           // Refresh failed (refresh token expired), force a full logout
//           isRefreshing = false;
//           processQueue(refreshError, null);
//           // Implement your full logout logic here
//           // window.location = '/login';
//           return Promise.reject(refreshError);
//         }
//       }

//       // If refresh *is* in progress, return the promise that will retry the request later
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then((token) => {
//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return API(originalRequest);
//       });
//     }

//     // For all other errors, reject the promise
//     return Promise.reject(error);
//   }
// );

// // ==============================
// // 🌟 API functions (No change needed here)
// // ==============================

// // Get all notifications
// export const getNotifications = async () => {
//   const res = await API.get("/notifications");
//   return res.data;
// };

// // Mark notification as read
// export const markNotificationAsRead = async (id) => {
//   const res = await API.put(`/notifications/${id}/read`);
//   return res.data;
// };

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// State to manage the token refreshing process
let isRefreshing = false;
let failedQueue = [];

// Function to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----------------------------------------------------------------------
// 1. REQUEST INTERCEPTOR: Attaches the Access Token
// ----------------------------------------------------------------------
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  req.headers = req.headers || {};

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    // Critical Fix: Remove stale header if token is missing
    delete req.headers.Authorization;
  }
  return req;
});

// ----------------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR: Handles Token Expiration (401)
// ----------------------------------------------------------------------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Check if the error is a 401 and we haven't already marked this request for retry
    if (
      status === 401 &&
      originalRequest.url !== `${API.defaults.baseURL}/refresh` &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // If refresh is NOT in progress, start it
      if (!isRefreshing) {
        isRefreshing = true;

        // --- 🛑 Start Token Refresh Logic 🛑 ---

        const refreshToken = localStorage.getItem("refreshToken"); // Assuming you save the long-lived token as 'refreshToken'

        // If the refresh token itself is missing, force logout
        if (!refreshToken) {
          // Implement your full logout logic here (e.g., clear localStorage, redirect to login)
          // window.location = '/login';
          return Promise.reject(error);
        }

        // Create a promise for the current failed request (optional, but good for queueing)
        // Note: The failed requests are queued below in the 'return new Promise' block

        try {
          // Call the /refresh endpoint (Using plain axios to avoid infinite interceptor loop)
          const refreshResponse = await axios.post(
            `${API.defaults.baseURL}/refresh`,
            { refreshToken: refreshToken } // Send the token in the body
          );

          const newAccessToken = refreshResponse.data.token;

          // 👇️ Logic added/confirmed here for robust refresh token handling
          const newRefreshToken =
            refreshResponse.data.refreshToken || refreshToken;

          // Save the new tokens
          localStorage.setItem("token", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken); // This is the final confirmed line

          // Update the Authorization header for all future requests
          API.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Process the queue of failed requests with the new token
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Return the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          // Refresh failed (refresh token expired), force a full logout
          isRefreshing = false;
          processQueue(refreshError, null);
          // Implement your full logout logic here
          // window.location = '/login';
          return Promise.reject(refreshError);
        }
      }

      // If refresh *is* in progress, return the promise that will retry the request later
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        // The queue processor will resolve this promise with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return API(originalRequest);
      });
    }

    // For all other errors, reject the promise
    return Promise.reject(error);
  }
);

// ==============================
// 🌟 API functions (No change needed here)
// ==============================

// Get all notifications
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

export const fetchNotesAPI = async () => {
  const res = await API.get("/notes");
  return res.data;
};

export const createNoteAPI = async (note) => {
  const res = await API.post("/notes", note);
  return res.data;
};

export default API;

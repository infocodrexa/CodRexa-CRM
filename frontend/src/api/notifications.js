// import API from "../utils/api";

// export const sendNotification = async (payload) => {
//   try {
//     const res = await API.post("/notifications", payload);
//     return res.data;
//   } catch (err) {
//     console.error("Error sending notification:", err.response?.data || err);
//     throw err;
//   }
// };


// अब आपकी sendNotification.js फ़ाइल ऐसी ही रहनी चाहिए (This file should stay simple)
import API from "../utils/api";

export const sendNotification = async (payload) => {
  try {
    // Interceptor खुद ही token जोड़ देगा, आपको यहाँ कुछ नहीं करना है।
    const res = await API.post("/notifications", payload); 
    return res.data;
  } catch (err) {
    console.error("Error sending notification:", err.response?.data || err);
    throw err;
  }
};

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Full URL to your backend
    headers: {
      "Content-Type": "application/json",
    },
});

// Attach token if present
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the failed request
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(error.config);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Redirect to login
        }
      }
    }
    return Promise.reject(error);
  }
);


export default api;

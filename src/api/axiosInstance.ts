import { axiosInstance } from ".";

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth state
    const token = localStorage.getItem("authToken");

    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Handle token refresh logic here if needed
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/auth/refresh-token', { refreshToken });
        // localStorage.setItem('authToken', response.data.token);
        // originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        // return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (redirect to login, etc.)
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL||'http://localhost:8080/api' ,
   

  withCredentials: true,

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});

<<<<<<< HEAD
// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("scholarnet_token") ||
      localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication and common API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirecting while already on public or authentication pages
      const currentPath = window.location.pathname;

      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/admin/login" &&
        currentPath !== "/" &&
        !currentPath.startsWith("/scholarships/public")
      ) {
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

=======
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
export default api;
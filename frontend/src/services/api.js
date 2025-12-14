import axios from "axios";
import _ from "lodash";
let baseUrl = import.meta.env.VITE_API_BASE;

// Check if base_url is stored in localStorage
if (!_.isEmpty(localStorage.getItem("base_url"))) {
  baseUrl = localStorage.getItem("base_url");
}

// Create an Axios instance
let api = axios.create({
  baseURL: baseUrl
});

// Request Interceptor - Add Authorization header
api.interceptors.request.use(
  async (config) => {
    // let token = await getStorageByKey("token");
    // if (token != null) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle base URL change and errors
api.interceptors.response.use(
  (response) => {
    if (response?.status === 200) {
      return response.data;
    }
  },
  (error) => {
    //let currentLocation = window.location.pathname;
    if (error?.response) {
      if (error.response?.status === 401) {
        showToast('error', error.response.data.message);
      }
    }
    if (error.response && error.response.data && error.response.data.message) {
      showToast('error', error.response.data.message);
    }
    return Promise.reject(error.response);
  }
);

export default api;

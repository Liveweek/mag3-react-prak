import axios from "axios";

const JWTToken = localStorage.getItem("access");
export const MAIN_URL = "http://127.0.0.1:3000/login";
export const API_URL = "http://127.0.0.1:8000/";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function apiSetHeader(name, value) {
  if (value) {
    api.defaults.headers[name] = value;
  }
}

if (JWTToken) {
  apiSetHeader("Bearer", `${JWTToken}`);
}

api.interceptors.response.use(
  (response) => {
    if (!response.config.headers["Bearer"]) {
      window.location.href = MAIN_URL;
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.clear();
      api
        .post("refresh")
        .then(function (response) {
          localStorage.setItem("access", response.data.access_token);
        })
        .catch(function (error) {
          window.location.href = MAIN_URL;
        });
    }
    return Promise.reject(error);
  }
);

export default api;
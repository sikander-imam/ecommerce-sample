import axios from "axios";

export default axios.create({
  mode: "no-cors",
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axios.interceptors.request.use(
  (request) => {
    request.headers["Authorization"] = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

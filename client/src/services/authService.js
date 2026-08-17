import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const adminLogin = async (email, password) => {
  const response = await API.post("/admin/login", {
    email,
    password,
  });

  return response.data;
};
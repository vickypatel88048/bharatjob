import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://bharatjob-2.onrender.com"}/api`,
});

export const adminLogin = async (email, password) => {
  const response = await API.post("/admin/login", {
    email,
    password,
  });

  return response.data;
};

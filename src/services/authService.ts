import axios from "axios";
const API = "http://localhost:8080/cinema/authentication";

export const login = async (usernameOrEmail: string, password: string) => {
  const res = await axios.post(`${API}/login`, { usernameOrEmail, password });
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (username: string, password: string, email: string, fullName: string) => {
  const res = await axios.post(`${API}/register`, { username, password, email, fullName });
  return res.data;
};

export const logout = () => localStorage.removeItem("token");
export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!getToken();


import API from "./api";

export async function login(body) {
  try {
    const response = await API.post("/auth/login", body);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function signup(body) {
  try {
    const response = await API.post("/auth/signup", body);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function verifyOtp(body) {
  try {
    const response = await API.post("/auth/verify-otp", body);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function checkAuth() {
  try {
    const res = await API.get("/auth/user");
    return res.data;
  } catch (err) {
    throw err;
  }
}

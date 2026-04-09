import { Response } from "express";
import API from "./api";

export async function login(body) {
  try {
    const response = await API.post("/auth/login", body);
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

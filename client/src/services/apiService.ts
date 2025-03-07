import { RefreshToken } from "./../../../app/src/models/token";
import API from "./api";
const API_URL = import.meta.env.VITE_BASE_URL;

export const signupUser = async (user) => {
  try {
    const response = await API.post(`${API_URL}/auth/register`, user);
    return response;
  } catch (err) {
    return err;
  }
};

export const loginUser = async (user) => {
  try {
    const response = await API.post(`${API_URL}/auth/login`, user);
    return response;
  } catch (err) {
    return err;
  }
};

export const googleLoginApi = async (deviceIp, code) => {
  try {
    const response = await API.get(
      `${API_URL}/auth/google?deviceIp=${deviceIp}&code=`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const googleLoginApi1 = async (deviceIp, code) => {
  try {
    const response = await API.post(
      `${API_URL}/auth/google?deviceIp=${deviceIp}&code=${code}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const facebookLogin = async (deviceIp) => {
  try {
    const response = await API.get(
      `${API_URL}/auth/facebook?deviceIp=${deviceIp}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    console.log(refreshToken);
    const response = await API.post(`${API_URL}/auth/logout-device`, {
      refreshToken: refreshToken,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const uploadFile = async (data) => {
  try {
    const response = await API.post(`${API_URL}/file/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const addComment = async (obj) => {
  try {
    const response = await API.post(`${API_URL}/comments`, obj);
    return response;
  } catch (err) {
    return err;
  }
};

export const getComments = async (id) => {
  try {
    const response = await API.get(`${API_URL}/comment/${id}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

export const deleteComments = async (id) => {
  try {
    const response = await API.get(`${API_URL}/comment/${id}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

export const savePost = async (post) => {
  try {
    const response = await API.post(`${API_URL}/post`, post);
    return response;
  } catch (err) {
    return err;
  }
};

export const updatePost = async (post, id) => {
  try {
    const response = await API.put(`${API_URL}/post/id`, post);
    return response.data;
  } catch (err) {
    return err;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await API.delete(`${API_URL}/post/${id}`);
    return response.data;
  } catch (err) {
    return err;
  }
};

export const getAllPost = async (category) => {
  console.log(category, "---category");
  try {
    const response = await API.get(`${API_URL}/post`, {
      params: { category: category },
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

export const getpostdetail = async (id) => {
  try {
    const response = await API.get(`${API_URL}/post/detail/${id}`);
    return response;
  } catch (err) {
    return err;
  }
};

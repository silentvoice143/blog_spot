import API from "./api";


export const draftPost = async (data) => {
  try {
    const response = await API.post(`/post/save-draft`, data);
    return response;
  } catch (err) {
    return err;
  }
};

export const publishPost = async (data) => {
  try {
    const response = await API.post(`/post/publish`, data);
    return response;
  } catch (err) {
    return err;
  }
};

export const schedulePost = async (data) => {
  try {
    const response = await API.post(`/post/schedule`, data);
    return response;
  } catch (err) {
    return err;
  }
};

//
// GET ALL POSTS
//
type GetAllPostsParams = {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export const getAllPosts = async (params: GetAllPostsParams) => {
  try {
    const response = await API.get("/post/all-posts", {
      params,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

//
// GET ALL POSTS
//
type GetMyPostsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getMyPosts = async (params: GetMyPostsParams) => {
  try {
    const response = await API.get("/post/my-posts", {
      params,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};




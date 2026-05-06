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



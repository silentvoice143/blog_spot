import API from "./api";

export const uploadSingleFile = async (data) => {
  try {
    const response = await API.post(`/file/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const uploadMultipleFile = async (data) => {
  try {
    const response = await API.post(`/file/upload-multiple`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (err) {
    return err;
  }
};

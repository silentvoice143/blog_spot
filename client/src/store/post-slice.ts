import { StateCreator } from "zustand";

export interface PostSlice {
  post: {
    title?: string;
    description?: string;
    content?: string;
    pictures?: string[];
  };

  setPost: (post: any) => void;
  clearPost: () => void;
}

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
  post: null,

  setPost: (post) =>
    set({
      post,
    }),

  clearPost: () =>
    set({
      post: null,
    }),
});

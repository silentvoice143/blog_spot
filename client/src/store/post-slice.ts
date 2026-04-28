import { StateCreator } from "zustand";

export interface PostSlice {
  post: {
    title?: string;
    description?: string;
    content?: string;
    pictures?: string[];
  };
  step: number;

  setStep: (step: number) => void;
  setPost: (post: any) => void;
  clearPost: () => void;
}

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
  post: null,
  step: 1,

  setStep: (step) =>
    set({
      step,
    }),

  setPost: (post) =>
    set({
      post,
    }),

  clearPost: () =>
    set({
      post: null, step: 1,

    }),
});

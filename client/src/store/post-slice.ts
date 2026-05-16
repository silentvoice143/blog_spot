import { StateCreator } from "zustand";

export interface PostSlice {
  post: {
    title?: string;
    description?: string;
    content?: string;
    postId?: string;
  };

  step: number;
  isSaving: boolean;
  isPublishing: boolean;
  isScheduling: boolean;

  setStep: (step: number) => void;
  setPost: (post: any) => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsPublishing: (isPublishing: boolean) => void;
  setIsScheduling: (isScheduling: boolean) => void;
  clearPost: () => void;
  submitRef: React.MutableRefObject<(() => Promise<void>) | null>;
  setSubmitRef: (ref: React.MutableRefObject<(() => Promise<void>) | null>) => void;
}

export const createPostSlice: StateCreator<PostSlice> = (set) => ({
  post: {
    title: "",
    description: "",
    content: "",
    postId: "",
  },
  step: 1,
  isPublishing: false,
  isSaving: false,
  isScheduling: false,

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

  setIsSaving: (isSaving: boolean) =>
    set({
      isSaving,
    }),

  setIsPublishing: (isPublishing: boolean) =>
    set({
      isPublishing,
    }),

  setIsScheduling: (isScheduling: boolean) =>
    set({
      isScheduling,
    }),
  submitRef: { current: null },
  setSubmitRef: (ref) => set({ submitRef: ref }),
});

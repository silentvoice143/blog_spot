import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice, AuthSlice } from "./auth-slice";
import { createPostSlice, PostSlice } from "./post-slice";

// Combine slices using intersection (&), not union (|)
type Store = AuthSlice & PostSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createPostSlice(...a),
    }),
    {
      name: "app-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        post: state.post,
      }),
    },
  ),
);

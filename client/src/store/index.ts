import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createAuthSlice, AuthSlice } from "./auth-slice";

// type Store = AuthSlice & UserSlice & PostSlice & ChatSlice;
type Store = AuthSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      //   ...createUserSlice(...a),
      //   ...createPostSlice(...a),
      //   ...createChatSlice(...a),
    }),
    {
      name: "app-storage",

      // ⚠️ Persist only what you need
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

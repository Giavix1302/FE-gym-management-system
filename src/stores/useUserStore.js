import { create } from "zustand"
import { persist } from "zustand/middleware"

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // ban đầu không có dữ liệu

      // cập nhật toàn bộ user từ BE
      setUser: (userData) => set({ user: userData }),

      // cập nhật từng field (nếu cần)
      updateUser: (fields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...fields } : fields,
        })),

      // reset user về null (khi logout)
      resetUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // key trong localStorage
    },
  ),
)

export default useUserStore

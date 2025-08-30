// store/useUserStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultUser = {
  _id: "",
  fullName: "",
  email: "",
  phone: "",
  avatar: "",
  age: 0,
  dateOfBirth: "",
  address: "",
  gender: "",
  role: "",
  status: "",
}

const useUserStore = create(
  persist(
    (set) => ({
      user: defaultUser,

      updateUser: (fields) =>
        set((state) => ({
          user: { ...state.user, ...fields },
        })),

      resetUser: () => set({ user: defaultUser }),
    }),
    {
      name: "user-storage", // tên key lưu trong localStorage
    },
  ),
)

export default useUserStore

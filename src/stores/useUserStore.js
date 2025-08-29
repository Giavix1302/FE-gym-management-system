// store/useUserStore.js
import { create } from "zustand"

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

const useUserStore = create((set) => ({
  user: defaultUser,
  isAuthenticated: false,

  // action cập nhật user
  updateUser: (fields) =>
    set((state) => ({
      user: { ...state.user, ...fields },
    })),

  // cách dùng: updateUser({ status: "active" })

  // reset về default
  resetUser: () => set({ user: defaultUser, isAuthenticated: false }),
}))

export default useUserStore

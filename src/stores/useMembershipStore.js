// store/useMembershipStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useMembershipStore = create(
  persist(
    (set) => ({
      listMembership: [], // mảng các gói tập

      // thêm 1 danh sách
      setPackages: (list) => set({ listMembership: list }),

      // Thêm gói tập mới
      addPackage: (membership) =>
        set((state) => {
          const exists = state.listMembership.some((m) => m._id === membership._id)
          if (exists) return state
          return { listMembership: [...state.listMembership, membership] }
        }),

      // Cập nhật gói tập theo id
      updatePackage: (_id, fields) =>
        set((state) => ({
          listMembership: state.listMembership.map((pkg) => (pkg._id === _id ? { ...pkg, ...fields } : pkg)),
        })),

      // Xóa gói tập theo id
      removePackage: (_id) =>
        set((state) => ({
          listMembership: state.listMembership.filter((pkg) => pkg._id !== _id),
        })),

      // Reset toàn bộ packages
      resetPackages: () => set({ listMembership: [] }),
    }),
    {
      name: "membership-storage", // key lưu trong localStorage
    },
  ),
)

export default useMembershipStore

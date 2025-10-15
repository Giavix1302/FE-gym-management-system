import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultTrainerInfo = {
  _id: "",
  userId: "",
  specialization: "",
  bio: "",
  physiqueImages: [],
  isApproved: "", // 'pending' | 'approved' | 'rejected'
  approvedAt: null, // Date hoặc null
}

const useTrainerInfoStore = create(
  persist(
    (set) => ({
      trainerInfo: defaultTrainerInfo,

      updateTrainerInfo: (fields) =>
        set((state) => ({
          trainerInfo: { ...state.trainerInfo, ...fields },
        })),

      resetTrainerInfo: () => set({ trainerInfo: defaultTrainerInfo }),
    }),
    {
      name: "trainer-info-storage", // key trong localStorage
    },
  ),
)

export default useTrainerInfoStore

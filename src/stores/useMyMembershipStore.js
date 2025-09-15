// store/useMyMembershipStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const defaultMyMembership = {
  remainingSessions: 0,
  startDate: "",
  endDate: "",
  status: "",
  name: "",
  bannerURL: "",
  durationMonth: 0,
  totalCheckin: 0,
}

const useMyMembershipStore = create(
  persist(
    (set) => ({
      myMembership: defaultMyMembership,

      updateMyMembership: (fields) =>
        set((state) => ({
          myMembership: { ...state.myMembership, ...fields },
        })),

      resetMyMembership: () => set({ myMembership: defaultMyMembership }),
    }),
    {
      name: "my-membership-storage",
    },
  ),
)

export default useMyMembershipStore

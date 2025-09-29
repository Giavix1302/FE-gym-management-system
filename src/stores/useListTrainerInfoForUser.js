import { create } from "zustand"
import { persist } from "zustand/middleware"

const useListTrainerInfoForUser = create(
  persist(
    (set) => ({
      listTrainerInfo: [],

      setListTrainerInfo: (trainers) =>
        set(() => ({
          listTrainerInfo: trainers,
        })),

      addTrainerInfo: (trainer) =>
        set((state) => ({
          listTrainerInfo: [...state.listTrainerInfo, trainer],
        })),

      updateTrainerInfo: (id, fields) =>
        set((state) => ({
          listTrainerInfo: state.listTrainerInfo.map((trainer) =>
            trainer._id === id ? { ...trainer, ...fields } : trainer,
          ),
        })),

      resetListTrainerInfo: () => set({ listTrainerInfo: [] }),
    }),
    {
      name: "list-trainer-info-for-user-storage", // key in localStorage
    },
  ),
)

export default useListTrainerInfoForUser

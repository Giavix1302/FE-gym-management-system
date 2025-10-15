import { create } from "zustand"
import { persist } from "zustand/middleware"

const useListTrainerInfoForAdmin = create(
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
            trainer._id === id
              ? {
                  ...trainer,
                  // merge sâu nếu có trainerInfo
                  trainerInfo: {
                    ...trainer.trainerInfo,
                    ...(fields.trainerInfo || {}),
                  },
                  ...fields, // merge các field khác ngoài trainerInfo
                }
              : trainer,
          ),
        })),

      resetListTrainerInfo: () => set({ listTrainerInfo: [] }),
    }),
    {
      name: "list-trainer-info-for-admin-storage", // key in localStorage
    },
  ),
)

export default useListTrainerInfoForAdmin

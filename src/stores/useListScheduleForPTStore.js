// useListScheduleForPTStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useListScheduleForPTStore = create(
  persist(
    (set) => ({
      listSchedule: [],

      setListSchedule: (schedules) =>
        set(() => ({
          listSchedule: schedules,
        })),

      addSchedule: (schedule) =>
        set((state) => ({
          listSchedule: [...state.listSchedule, schedule],
        })),

      updateSchedule: (scheduleId, fields) =>
        set((state) => ({
          listSchedule: state.listSchedule.map((s) => (s._id === scheduleId ? { ...s, ...fields } : s)),
        })),

      removeSchedule: (scheduleId) =>
        set((state) => ({
          listSchedule: state.listSchedule.filter((s) => s._id !== scheduleId),
        })),

      resetListSchedule: () => set({ listSchedule: [] }),
    }),
    {
      name: "pt-schedule-storage", // key trong localStorage
    },
  ),
)

export default useListScheduleForPTStore

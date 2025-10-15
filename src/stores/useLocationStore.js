// useLocationStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useLocationStore = create(
  persist(
    (set) => ({
      locations: [],

      setLocations: (locations) =>
        set(() => ({
          locations: locations,
        })),

      addLocation: (location) =>
        set((state) => ({
          locations: [...state.locations, location],
        })),

      updateLocation: (locationId, fields) =>
        set((state) => ({
          locations: state.locations.map((l) => (l._id === locationId ? { ...l, ...fields } : l)),
        })),

      removeLocation: (locationId) =>
        set((state) => ({
          locations: state.locations.filter((l) => l._id !== locationId),
        })),

      resetLocations: () => set({ locations: [] }),
    }),
    {
      name: "location-storage", // key trong localStorage
    },
  ),
)

export default useLocationStore

import { create } from "zustand"
import { persist } from "zustand/middleware"

const useRoomsStore = create(
  persist(
    (set) => ({
      rooms: [],

      setRooms: (rooms) =>
        set(() => ({
          rooms: rooms,
        })),

      addRoom: (room) =>
        set((state) => ({
          rooms: [...state.rooms, room],
        })),

      updateRoom: (id, fields) =>
        set((state) => ({
          rooms: state.rooms.map((room) => (room._id === id ? { ...room, ...fields } : room)),
        })),

      removeRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room._id !== id),
        })),

      resetRooms: () => set({ rooms: [] }),
    }),
    {
      name: "rooms-storage", // key trong localStorage
    },
  ),
)

export default useRoomsStore

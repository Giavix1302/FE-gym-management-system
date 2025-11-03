import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCurrentLocation = create(
  persist(
    (set) => ({
      currentLocation: null, // vị trí hiện tại (latitude, longitude hoặc object)

      // cập nhật toàn bộ location
      setCurrentLocation: (locationData) => set({ currentLocation: locationData }),

      // cập nhật một phần (chỉ một số field, ví dụ latitude hoặc name)
      updateCurrentLocation: (fields) =>
        set((state) => ({
          currentLocation: state.currentLocation ? { ...state.currentLocation, ...fields } : fields,
        })),

      // reset vị trí (ví dụ khi logout hoặc rời khỏi khu vực)
      resetCurrentLocation: () => set({ currentLocation: null }),
    }),
    {
      name: "current-location-storage", // key lưu trong localStorage
    },
  ),
)

export default useCurrentLocation

import { create } from "zustand"
import { persist } from "zustand/middleware"

const useStaffStore = create(
  persist(
    (set) => ({
      staff: null, // dữ liệu staff hiện tại

      // Gán toàn bộ dữ liệu staff (ví dụ lấy từ BE)
      setStaff: (staffData) => set({ staff: staffData }),

      // Cập nhật một vài field trong staff
      updateStaff: (fields) =>
        set((state) => ({
          staff: state.staff ? { ...state.staff, ...fields } : fields,
        })),

      // Reset staff về null (ví dụ khi logout)
      resetStaff: () => set({ staff: null }),
    }),
    {
      name: "staff-storage", // key trong localStorage
    },
  ),
)

export default useStaffStore

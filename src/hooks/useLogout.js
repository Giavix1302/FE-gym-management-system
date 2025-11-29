import useUserStore from "~/stores/useUserStore"
import { useNavigate } from "react-router-dom"
import useMembershipStore from "~/stores/useMembershipStore"
import { removeFromLocalStorage } from "~/utils/common"
import { logoutAPI } from "~/apis/auth"
import useMyMembershipStore from "~/stores/useMyMembershipStore"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import useRoomsStore from "~/stores/useRoomsStore"
import useListScheduleForPTStore from "~/stores/useListScheduleForPTStore"
import useListTrainerInfoForUser from "~/stores/useListTrainerInfoForUser"
import useLocationStore from "~/stores/useLocationStore"
import useEquipmentForAdminStore from "~/stores/useEquipmentForAdminStore"
import { handleLogoutStaff } from "~/apis/staff"
import useStaffStore from "~/stores/useStaffStore"

export function useLogout() {
  const { resetListSchedule } = useListScheduleForPTStore()
  const { resetListTrainerInfo } = useListTrainerInfoForAdmin()
  const { resetListTrainerInfo: resetListTrainerInfoForUser } = useListTrainerInfoForUser()
  const { resetLocations } = useLocationStore()
  const { resetPackages } = useMembershipStore()
  const { resetMyMembership } = useMyMembershipStore()
  const { resetRooms } = useRoomsStore()
  const { resetTrainerInfo } = useTrainerInfoStore()
  const { user, resetUser } = useUserStore()
  const { clearStore } = useEquipmentForAdminStore()
  const { staff, resetStaff } = useStaffStore()

  const navigate = useNavigate()

  const logout = async () => {
    try {
      // 🔥 THÊM: Nếu user là staff thì gọi API logout staff trước
      if (user?.role === "staff" && staff?._id) {
        try {
          console.log("🚀 Logging out staff:", staff._id)
          const staffLogoutResult = await handleLogoutStaff(staff._id)

          if (staffLogoutResult.success) {
            console.log("✅ Staff logged out successfully. Hours worked:", staffLogoutResult.hours)
            // Có thể hiện thông báo cho user biết số giờ đã làm
            // alert(`Bạn đã làm việc ${staffLogoutResult.hours} giờ hôm nay!`)
          } else {
            console.error("❌ Staff logout failed:", staffLogoutResult.message)
          }
        } catch (staffLogoutError) {
          console.error("❌ Error during staff logout:", staffLogoutError)
          // Vẫn tiếp tục logout dù có lỗi
        }
      }

      // xóa accessToken
      removeFromLocalStorage("accessToken")
      // xóa store
      resetListSchedule()
      resetListTrainerInfo()
      resetListTrainerInfoForUser()
      resetLocations()
      resetMyMembership()
      resetTrainerInfo()
      resetPackages()
      resetRooms()
      resetUser()
      clearStore()
      resetStaff()
      // call API xóa refreshToken
      await logoutAPI() // gọi API logout nếu cần
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      // chuyển về trang login
      navigate("/login")
    }
  }

  return logout
}

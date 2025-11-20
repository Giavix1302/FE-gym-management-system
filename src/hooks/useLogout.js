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
import useChatStore from "~/stores/useChatStore"
import useEquipmentForAdminStore from "~/stores/useEquipmentForAdminStore"
import { handleLogoutStaff } from "~/apis/staff"
import useStaffStore from "~/stores/useStaffStore"

export function useLogout() {
  const { reset } = useChatStore()
  const { resetListSchedule } = useListScheduleForPTStore()
  const { resetListTrainerInfo } = useListTrainerInfoForAdmin()
  const { resetListTrainerInfo: resetListTrainerInfoForUser } = useListTrainerInfoForUser()
  const { resetLocations } = useLocationStore()
  const { resetPackages } = useMembershipStore()
  const { resetMyMembership } = useMyMembershipStore()
  const { resetRooms } = useRoomsStore()
  const { resetTrainerInfo } = useTrainerInfoStore()
  const { resetUser } = useUserStore()
  const { clearStore } = useEquipmentForAdminStore()
  const { staff, resetStaff } = useStaffStore()

  const navigate = useNavigate()

  const logout = async () => {
    try {
      // xóa accessToken
      removeFromLocalStorage("accessToken")
      // xóa store
      reset()
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

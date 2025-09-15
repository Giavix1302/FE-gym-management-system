import useUserStore from "~/stores/useUserStore"
import { useNavigate } from "react-router-dom"
import useMembershipStore from "~/stores/useMembershipStore"
import { removeFromLocalStorage } from "~/utils/common"
import { logoutAPI } from "~/apis/auth"
import useMyMembershipStore from "~/stores/useMyMembershipStore"

export function useLogout() {
  const { resetPackages } = useMembershipStore()
  const { resetMyMembership } = useMyMembershipStore()
  const { resetUser } = useUserStore()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      // xóa accessToken
      removeFromLocalStorage("accessToken")
      // xóa store
      resetUser()
      resetMyMembership()
      resetPackages()
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

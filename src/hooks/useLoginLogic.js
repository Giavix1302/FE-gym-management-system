// useLoginLogic.js (Ví dụ: src/hooks/useLoginLogic.js)
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { loginAPI } from "~/apis/auth"
import { getListLocationAPI } from "~/apis/location"
import { getListRoomAPI } from "~/apis/room"
import { getListTrainerForAdminAPI } from "~/apis/trainer"
import { getListScheduleByTrainerIdAPI } from "~/apis/schedule"
import { getListMembershipAPI } from "~/apis/membership"
import { formatPhoneNumber, isValidPhone, saveToLocalStorage } from "~/utils/common"

// Stores
import useUserStore from "~/stores/useUserStore"
import useMyMembershipStore from "~/stores/useMyMembershipStore"
import useTrainerInfoStore from "~/stores/useTrainerInfoStore"
import useLocationStore from "~/stores/useLocationStore"
import useRoomsStore from "~/stores/useRoomsStore"
import useListTrainerInfoForAdmin from "~/stores/useListTrainerInfoForAdmin"
import useListScheduleForPTStore from "~/stores/useListScheduleForPTStore"
import useCurrentLocation from "~/stores/useCurrentLocationStore"
import useStaffStore from "~/stores/useStaffStore"
import useMembershipStore from "~/stores/useMembershipStore"

/**
 * Xử lý toàn bộ logic liên quan đến đăng nhập, validation, API calls,
 * cập nhật store và điều hướng (navigation).
 * @returns {object} Các state, hàm xử lý state và hàm đăng nhập.
 */
export const useLoginLogic = () => {
  const navigate = useNavigate()

  // State cục bộ (local state) cho form
  const [phone, setPhone] = useState("")
  const [isPhoneError, setIsPhoneError] = useState(false)
  const [password, setPassword] = useState("")
  const [isPasswordError, setIsPasswordError] = useState(false)

  // Hàm cập nhật Stores
  const { updateUser } = useUserStore()
  const { updateMyMembership } = useMyMembershipStore()
  const { updateTrainerInfo, resetTrainerInfo } = useTrainerInfoStore()
  const { setLocations } = useLocationStore()
  const { setRooms } = useRoomsStore()
  const { setListTrainerInfo } = useListTrainerInfoForAdmin()
  const { setListSchedule } = useListScheduleForPTStore()
  const { setCurrentLocation } = useCurrentLocation()
  const { setStaff } = useStaffStore()
  const { setPackages } = useMembershipStore()

  // --- LOGIC XỬ LÝ CHÍNH ---
  const handleLogin = async () => {
    // 1. Reset lỗi và Validation cơ bản
    setIsPhoneError(false)
    setIsPasswordError(false)

    if (phone === "") {
      toast.error("Vui lòng nhập số điện thoại")
      setIsPhoneError(true)
      return
    }
    if (password === "") {
      toast.error("Vui lòng nhập mật khẩu")
      setIsPasswordError(true)
      return
    }
    if (phone !== "" && !isValidPhone(phone)) {
      toast.error("Số điện thoại gồm 10 số và số 0 đầu tiên")
      setIsPhoneError(true)
      return
    }

    const formatPhone = formatPhoneNumber(phone)

    try {
      // 2. Gọi API Đăng nhập
      const data = await loginAPI(formatPhone, password)

      if (data.success) {
        saveToLocalStorage("accessToken", data.accessToken)
        toast.success("Đăng nhập thành công")

        // 3. Lấy dữ liệu Location chung (dùng cho mọi role)
        const locationData = await getListLocationAPI()
        setLocations(locationData.locations)

        // 4. Xử lý theo Role và điều hướng
        const { user } = data

        if (user.role === "admin") {
          updateUser(user)
          const resultRoom = await getListRoomAPI()
          if (resultRoom.success) setRooms(resultRoom.rooms)
          const response = await getListTrainerForAdminAPI()
          if (response.success && response.listTrainerInfo) {
            setListTrainerInfo(response.listTrainerInfo)
          }
          navigate("/admin/dashboard")
        } else if (user.role === "staff") {
          const listMembership = await getListMembershipAPI()
          setPackages(listMembership.memberships)
          updateUser(user)
          setCurrentLocation(data?.locationInfo)
          setStaff(data?.staffInfo)

          // trainer
          const response = await getListTrainerForAdminAPI()
          if (response.success && response.listTrainerInfo) {
            setListTrainerInfo(response.listTrainerInfo)
          }
          navigate("/staff/dashboard")
        } else if (user.role === "user") {
          updateUser(user)
          updateMyMembership(data.myMembership)
          navigate("/user/home")
        } else if (user.role === "pt") {
          updateUser(user)
          if (data.trainer && Object.keys(data.trainer).length > 0) {
            updateTrainerInfo(data.trainer)
            const result = await getListScheduleByTrainerIdAPI(data.trainer._id)
            setListSchedule(result.listSchedule)
          } else {
            resetTrainerInfo()
          }
          navigate("/pt/home")
        }
      }
    } catch (error) {
      // API login sẽ xử lý toast error nếu thất bại (dựa trên cách bạn triển khai)
      console.error("Lỗi đăng nhập:", error)
    }
  }

  // Trả về các giá trị cần thiết cho UI
  return {
    phone,
    setPhone,
    isPhoneError,
    password,
    setPassword,
    isPasswordError,
    handleLogin,
  }
}

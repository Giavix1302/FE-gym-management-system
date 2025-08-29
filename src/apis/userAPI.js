import axios from "axios"
import { toast } from "react-toastify"
import { formatPhoneNumber } from "~/utils"
import { API_ROOT } from "~/utils/constants"

export const updateInfoUserAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoUserAPI ~ payload:", payload)
  try {
    const response = await axios.put(`${API_ROOT}/users/${userId}`, payload)
    return response.data // thường lấy .data thay vì return nguyên response
  } catch (err) {
    toast.error(err.response?.data?.message || "Cập nhật thất bại")
    throw err // nên throw để FE biết request fail
  }
}

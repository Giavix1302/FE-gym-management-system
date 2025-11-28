import { toast } from "react-toastify"
import { axiosPublic } from "./axiosConfig"

// Login (dùng axiosPublic vì chưa có token)
export const getListLocation = async () => {
  try {
    const rep = await axiosPublic.get("/locations")
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

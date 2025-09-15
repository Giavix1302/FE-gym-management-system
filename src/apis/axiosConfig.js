import axios from "axios"
import { toast } from "react-toastify"
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "~/utils/common"

const API_URL = import.meta.env.VITE_API_URL + "/v1"

export const axiosPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// Request interceptor -> gắn access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getFromLocalStorage("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status || 0 // fallback
    console.log("🚀 ~ status:", status)

    // Access token hết hạn
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axiosPublic.post("/auths/refresh", {}, { withCredentials: true })
        const newAccessToken = res.data.accessToken
        saveToLocalStorage("accessToken", newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        removeFromLocalStorage("accessToken")
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại")
        window.location.href = "/"
        return Promise.reject(refreshError)
      }
    }

    // Các lỗi khác
    const errorMessage = error.response?.data?.message || error.message || "Đã xảy ra lỗi hệ thống"
    console.log("🚀 ~ errorMessage:", errorMessage)

    switch (status) {
      case 400:
        toast.error(errorMessage)
        break
      case 403:
        toast.error(errorMessage || "Bạn không có quyền truy cập (403)")
        break
      case 404:
        toast.error(errorMessage || "Không tìm thấy tài nguyên (404)")
        break
      case 500:
        toast.error(errorMessage || "Lỗi server, vui lòng thử lại sau (500)")
        break
      default:
        toast.error(errorMessage || errorMessage)
    }

    return Promise.reject(error)
  },
)

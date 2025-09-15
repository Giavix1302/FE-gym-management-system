// src/apis/authAPI.js
import { toast } from "react-toastify"
import { axiosPublic } from "./axiosConfig"
import { formatPhoneNumber } from "~/utils/common"

// Login (dùng axiosPublic vì chưa có token)
export const loginAPI = async (phone, password) => {
  try {
    const rep = await axiosPublic.post("/auths/login", { phone, password })
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

export const signupAPI = async (data) => {
  try {
    const response = await axiosPublic.post("/auths/signup", data)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

// Verify OTP (dùng axiosPublic vì chưa có token)
export const verifyOtpAPI = async (phone, code) => {
  const rep = await axiosPublic.post("/auths/verify", {
    phone: formatPhoneNumber(phone),
    code,
  })
  return rep.data
}

export const logoutAPI = async () => {
  try {
    await axiosPublic.post("/auths/logout", {}, { withCredentials: true })
  } catch (err) {
    console.error("Logout failed", err)
  }
}

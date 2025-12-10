// src/apis/authAPI.js
import { toast } from "react-toastify"
import { axiosPublic } from "./axiosConfig"
import { formatPhoneNumber } from "~/utils/common"

// Login (dùng axiosPublic vì chưa có token)
export const loginAPI = async (phone, password) => {
  try {
    const rep = await axiosPublic.post("/auths/login", { phone, password })
    console.log("🚀 ~ loginAPI ~ rep:", rep)
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

export const signupAPI = async (data) => {
  console.log("🚀 ~ signupAPI ~ data:", data)
  try {
    const response = await axiosPublic.post("/auths/signup", data)
    console.log("🚀 ~ signupAPI ~ response:", response)
    return response.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

// Verify OTP (dùng axiosPublic vì chưa có token)
export const verifyOtpAPI = async (phone, code) => {
  console.log("🚀 ~ verifyOtpAPI ~ phone, code:", phone, code)
  try {
    const rep = await axiosPublic.post("/auths/verify", {
      phone: formatPhoneNumber(phone),
      code,
    })
    console.log("🚀 ~ verifyOtpAPI ~ rep:", rep)
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

export const logoutAPI = async () => {
  try {
    await axiosPublic.post("/auths/logout", {}, { withCredentials: true })
  } catch (err) {
    console.error("Logout failed", err)
  }
}

export const forgotPasswordSentOptAPI = async (phone) => {
  console.log("🚀 ~ forgotPasswordSentOptAPI ~ phone:", phone)
  try {
    const rep = await axiosPublic.post("/auths/forgot-password/sent-opt", { phone })
    console.log("🚀 ~ forgotPasswordSentOptAPI ~ rep:", rep)
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

export const forgotPasswordVerifyOtpAPI = async (phone, code) => {
  console.log("🚀 ~ forgotPasswordVerifyOtpAPI ~ phone, code:", phone, code)
  try {
    const rep = await axiosPublic.post("/auths/forgot-password/verify", { phone, code })
    console.log("🚀 ~ forgotPasswordVerifyOtpAPI ~ rep:", rep)
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

export const resetPasswordAPI = async (phone, password) => {
  console.log("🚀 ~ resetPasswordAPI ~ phone:", phone)
  console.log("🚀 ~ resetPasswordAPI ~ password:", password)
  try {
    const rep = await axiosPublic.post("/users/reset-password", { phone, plainPassword: password })
    console.log("🚀 ~ resetPasswordAPI ~ rep:", rep)
    return rep.data
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Lỗi hệ thống"
    toast.error(errorMessage)
    throw err
  }
}

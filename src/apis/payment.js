import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const createLinkVnpayAPI = async (subId) => {
  const rep = await axiosInstance.post("/payments/vnpay/subscription/" + subId)
  return rep.data
}

export const createLinkVnpayBookingPaymentAPI = async (data) => {
  console.log("🚀 ~ createLinkVnpayBookingPaymentAPI ~ data:", data)
  const rep = await axiosInstance.post("/payments/vnpay/booking", data)
  return rep.data
}

export const createLinkVnpayClassPaymentAPI = async (data) => {
  const rep = await axiosInstance.post("/payments/vnpay/class", data)
  return rep.data
}

// Lấy danh sách payment theo userId
export const getPaymentsByUserIdAPI = async (userId, page = 1, limit = 10) => {
  const rep = await axiosInstance.get(`/payments/user/${userId}?page=${page}&limit=${limit}`)
  return rep.data
}

// Lấy danh sách tất cả payment cho admin
export const getAllPaymentsForAdminAPI = async (page = 1, limit = 10) => {
  const rep = await axiosInstance.get(`/payments/admin/all?page=${page}&limit=${limit}`)
  return rep.data
}

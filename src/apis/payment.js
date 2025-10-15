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

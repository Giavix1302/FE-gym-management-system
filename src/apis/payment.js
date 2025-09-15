import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

// Login (dùng axiosPublic vì chưa có token)
export const createLinkVnpayAPI = async (subId) => {
  const rep = await axiosInstance.post("/payments/vnpay/" + subId)
  return rep.data
}

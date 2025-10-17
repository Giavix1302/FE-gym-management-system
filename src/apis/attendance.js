import { axiosInstance } from "./axiosConfig"

// NEW: Unified toggle attendance API (handles both checkin and checkout)
export const toggleAttendanceQrCodeAPI = async (data) => {
  const rep = await axiosInstance.post("/attendances/qr-code/toggle", data)
  return rep.data
}

// Legacy APIs (kept for backward compatibility)
export const createCheckinQrCodeAPI = async (data) => {
  const rep = await axiosInstance.post("/attendances/qr-code/checkin", data)
  return rep.data
}

export const updateCheckoutQrCodeAPI = async (data) => {
  const rep = await axiosInstance.put("/attendances/qr-code/checkout", data)
  return rep.data
}

export const getListAttendanceByLocationIdAPI = async (locationId, data) => {
  console.log("🚀 ~ getListAttendanceByLocationIdAPI ~ data:", data)
  const rep = await axiosInstance.get(`/attendances/location/${locationId}`, {
    params: data,
  })
  return rep.data
}

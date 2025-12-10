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

// NEW: Get paginated list of user attendances
export const getListAttendanceByUserIdAPI = async (userId, params = {}) => {
  console.log("🚀 ~ getListAttendanceByUserIdAPI ~ params:", params)
  const rep = await axiosInstance.get(`/attendances/list/${userId}`, {
    params: params,
  })
  console.log("🚀 ~ getListAttendanceByUserIdAPI ~ rep:", rep)
  return rep.data
}

// Additional attendance APIs
export const getActiveAttendanceAPI = async (userId) => {
  const rep = await axiosInstance.get(`/attendances/active/${userId}`)
  return rep.data
}

export const getUserHistoryAPI = async (userId, params = {}) => {
  const rep = await axiosInstance.get(`/attendances/history/${userId}`, {
    params: params,
  })
  return rep.data
}

export const getAttendanceDetailAPI = async (attendanceId) => {
  const rep = await axiosInstance.get(`/attendances/${attendanceId}`)
  return rep.data
}

export const updateAttendanceAPI = async (attendanceId, data) => {
  const rep = await axiosInstance.put(`/attendances/${attendanceId}`, data)
  return rep.data
}

export const deleteAttendanceAPI = async (attendanceId) => {
  const rep = await axiosInstance.delete(`/attendances/${attendanceId}`)
  return rep.data
}

import { axiosInstance } from "./axiosConfig"

// for pt
export const updateInfoTrainerByUserIdAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoTrainerByUserIdAPI ~ userId:", userId)
  for (const [key, value] of payload.entries()) {
    console.log(key, value)
  }
  const res = await axiosInstance.put(`/trainers/${userId}`, payload)
  return res.data
}

export const updateIsApprovedAPI = async (trainerId, payload) => {
  const res = await axiosInstance.put(`/trainers/is-approved/${trainerId}`, payload)
  return res.data
}

// for user
export const getListTrainerForUserAPI = async () => {
  const res = await axiosInstance.get(`/trainers/user`)
  return res.data
}

//
export const getListTrainerForAdminAPI = async () => {
  const res = await axiosInstance.get(`/trainers/admin`)
  return res.data
}

// Lấy danh sách booking completed của trainer
export const getListBookingByTrainerIdAPI = async (userId, page = 1, limit = 10) => {
  const res = await axiosInstance.get(`/trainers/${userId}/bookings`, {
    params: {
      page,
      limit,
    },
  })
  return res.data
}

// Hoặc có thể viết với options object để linh hoạt hơn
export const getTrainerBookingsAPI = async (userId, options = {}) => {
  const { page = 1, limit = 10 } = options

  const res = await axiosInstance.get(`/trainers/${userId}/bookings`, {
    params: {
      page,
      limit,
    },
  })
  return res.data
}

export const getTrainerDashboardStatsAPI = async (userId) => {
  const res = await axiosInstance.get(`/trainers/${userId}/dashboard-stats`)
  return res.data
}

export const getTrainerEventsForThreeMonthsAPI = async (userId) => {
  const res = await axiosInstance.get(`/trainers/${userId}/events`)
  return res.data
}

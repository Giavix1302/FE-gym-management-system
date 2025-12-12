import { axiosInstance } from "./axiosConfig"

export const getUpcomingBookingsByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get(`/bookings/user/${userId}/upcoming`)
  console.log("🚀 ~ getUpcomingBookingsByUserIdAPI ~ rep:", rep)
  return rep.data
}

export const getHistoryBookingsByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get(`/bookings/user/${userId}/history`)
  console.log("🚀 ~ getHistoryBookingsByUserIdAPI ~ rep:", rep)
  return rep.data
}

export const getBookingsByTrainerIdAPI = async (trainerId) => {
  const rep = await axiosInstance.get(`/bookings/trainer/${trainerId}`)
  return rep.data
}

export const cancelBookingAPI = async (bookingId) => {
  const rep = await axiosInstance.patch(`/bookings/${bookingId}/cancel`)
  console.log("🚀 ~ cancelBookingAPI ~ rep:", rep)
  return rep.data
}

export const updateTrainerAdviceAPI = async (bookingId, advice) => {
  console.log("🚀 ~ updateTrainerAdviceAPI ~ bookingId, advice:", bookingId, advice)
  const rep = await axiosInstance.patch(`/bookings/${bookingId}/trainer-advice`, advice)
  console.log("🚀 ~ updateTrainerAdviceAPI ~ rep:", rep)
  return rep.data
}

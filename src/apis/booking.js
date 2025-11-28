import { axiosInstance } from "./axiosConfig"

export const getUpcomingBookingsByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get(`/bookings/user/${userId}/upcoming`)
  return rep.data
}

export const getHistoryBookingsByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get(`/bookings/user/${userId}/history`)
  return rep.data
}

export const getBookingsByTrainerIdAPI = async (trainerId) => {
  const rep = await axiosInstance.get(`/bookings/trainer/${trainerId}`)
  return rep.data
}

export const cancelBookingAPI = async (bookingId) => {
  const rep = await axiosInstance.patch(`/bookings/${bookingId}/cancel`)
  return rep.data
}

export const updateTrainerAdviceAPI = async (bookingId, advice) => {
  const rep = await axiosInstance.patch(`/bookings/${bookingId}/trainer-advice`, advice)
  return rep.data
}

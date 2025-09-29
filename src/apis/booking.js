import { axiosInstance } from "./axiosConfig"

export const getUpcomingBookingsByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get(`/bookings/user/${userId}/upcoming`)
  return rep.data
}

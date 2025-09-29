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

// for user
export const getListTrainerForUserAPI = async () => {
  const res = await axiosInstance.get(`/trainers`)
  return res.data
}

import { axiosInstance } from "./axiosConfig"

export const updateInfoTrainerByUserIdAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoTrainerByUserIdAPI ~ userId:", userId)
  for (const [key, value] of payload.entries()) {
    console.log(key, value)
  }
  const res = await axiosInstance.put(`/trainers/${userId}`, payload)
  return res.data
}

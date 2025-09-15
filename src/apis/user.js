import { axiosInstance } from "./axiosConfig"

export const updateInfoUserAPI = async (userId, payload) => {
  console.log("🚀 ~ updateInfoUserAPI ~ payload:", payload)
  const res = await axiosInstance.put(`/users/${userId}`, payload)
  return res.data
}

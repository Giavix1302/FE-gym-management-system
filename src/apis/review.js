import { axiosInstance } from "./axiosConfig"

export const createReviewAPI = async (data) => {
  const rep = await axiosInstance.post("/reviews", data)
  return rep.data
}

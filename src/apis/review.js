import { axiosInstance } from "./axiosConfig"

export const createReviewAPI = async (data) => {
  console.log("🚀 ~ createReviewAPI ~ data:", data)
  const rep = await axiosInstance.post("/reviews", data)
  console.log("🚀 ~ createReviewAPI ~ rep:", rep)
  return rep.data
}

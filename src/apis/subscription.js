import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const createSubscriptionAPI = async (userId, membershipId) => {
  const rep = await axiosInstance.post("/subscriptions", { userId, membershipId })
  return rep.data
}

export const getSubscriptionByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get("/subscriptions/" + userId)
  return rep.data
}

export const deleteSubscriptionAPI = async (subId) => {
  console.log("🚀 ~ deleteSubscriptionAPI ~ subId:", subId)
  const rep = await axiosInstance.delete("/subscriptions/" + subId)
  return rep.data
}

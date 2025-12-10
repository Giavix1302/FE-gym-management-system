import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const createSubscriptionAPI = async (userId, membershipId) => {
  const rep = await axiosInstance.post("/subscriptions", { userId, membershipId })
  return rep.data
}

export const createSubscriptionForStaffAPI = async (data) => {
  const rep = await axiosInstance.post("/subscriptions/staff", data)
  return rep.data
}

export const getSubscriptionByUserIdAPI = async (userId) => {
  const rep = await axiosInstance.get("/subscriptions/" + userId)
  console.log("🚀 ~ getSubscriptionByUserIdAPI ~ rep:", rep)
  return rep.data
}

export const deleteSubscriptionAPI = async (subId) => {
  console.log("🚀 ~ deleteSubscriptionAPI ~ subId:", subId)
  const rep = await axiosInstance.delete("/subscriptions/" + subId)
  console.log("🚀 ~ deleteSubscriptionAPI ~ rep:", rep)
  return rep.data
}

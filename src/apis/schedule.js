import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const getListScheduleByTrainerIdAPI = async (trainerId) => {
  const rep = await axiosInstance.get("/schedules/" + trainerId)
  console.log("🚀 ~ getListScheduleByTrainerIdAPI ~ rep:", rep)
  return rep.data
}

export const createScheduleForPtAPI = async (data) => {
  console.log("🚀 ~ createScheduleForPtAPI ~ data:", data)
  const rep = await axiosInstance.post("/schedules", data)
  console.log("🚀 ~ createScheduleForPtAPI ~ rep:", rep)
  return rep.data
}

export const deleteScheduleForPtAPI = async (scheduleId) => {
  const rep = await axiosInstance.delete("/schedules/" + scheduleId)
  console.log("🚀 ~ deleteScheduleForPtAPI ~ rep:", rep)
  return rep.data
}

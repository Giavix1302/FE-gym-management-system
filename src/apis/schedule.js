import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

export const getListScheduleByTrainerIdAPI = async (trainerId) => {
  const rep = await axiosInstance.get("/schedules/" + trainerId)
  return rep.data
}

export const createScheduleForPtAPI = async (data) => {
  const rep = await axiosInstance.post("/schedules", data)
  return rep.data
}

export const deleteScheduleForPtAPI = async (scheduleId) => {
  const rep = await axiosInstance.delete("/schedules/" + scheduleId)
  return rep.data
}

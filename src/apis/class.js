import { axiosInstance } from "./axiosConfig"

export const createClassAPI = async (formData) => {
  const rep = await axiosInstance.post("/classes", formData)
  return rep.data
}

export const getListClassForAdminAPI = async () => {
  const rep = await axiosInstance.get("/classes/admin")
  return rep.data
}

export const getListClassForUserAPI = async () => {
  const rep = await axiosInstance.get("/classes/user")
  return rep.data
}

export const getMemberEnrolledClassesAPI = async (userId) => {
  const rep = await axiosInstance.get("/classes/user/" + userId)
  return rep.data
}

export const getListClassForTrainerAPI = async (trainerId) => {
  const rep = await axiosInstance.get("/classes/trainer/" + trainerId)
  return rep.data
}

export const updateClassInfoAPI = async (classId, updateData) => {
  const rep = await axiosInstance.put("/classes/" + classId, updateData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

export const deleteClassAPI = async (classId) => {
  const rep = await axiosInstance.delete("/classes/" + classId)
  return rep.data
}

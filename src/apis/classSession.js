import { axiosInstance } from "./axiosConfig"

export const updateClassSessionAPI = async (classSessionId, dataUpdate) => {
  const rep = await axiosInstance.put("/class-sessions/" + classSessionId, dataUpdate)
  return rep.data
}

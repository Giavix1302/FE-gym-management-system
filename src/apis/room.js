import { axiosInstance } from "./axiosConfig"

export const getListRoomAPI = async () => {
  const rep = await axiosInstance.get("/rooms")
  return rep.data
}

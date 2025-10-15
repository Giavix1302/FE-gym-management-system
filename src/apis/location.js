import { axiosInstance } from "./axiosConfig"

export const getListLocationAPI = async () => {
  const rep = await axiosInstance.get("/locations")
  return rep.data
}

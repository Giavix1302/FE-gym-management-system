import { axiosInstance } from "./axiosConfig"

export const getDataDashboardForAdminAPI = async () => {
  const rep = await axiosInstance.get(`/statistics/admin/dashboard`)
  return rep.data
}

import { axiosInstance } from "./axiosConfig"

export const getDataDashboardForAdminAPI = async () => {
  const rep = await axiosInstance.get(`/statistics/admin/dashboard`)
  console.log("🚀 ~ getDataDashboardForAdminAPI ~ rep:", rep)
  return rep.data
}

export const getDataDashboardForStaffAPI = async (locationId) => {
  const rep = await axiosInstance.get(`/statistics/staff/dashboard/${locationId}`)
  return rep.data
}

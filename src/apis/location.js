import { axiosInstance } from "./axiosConfig"

export const getListLocationAPI = async () => {
  const rep = await axiosInstance.get("/locations")
  return rep.data
}

// Lấy danh sách location cho admin (với equipments, staff count, room count)
export const getListLocationForAdminAPI = async (page = 1, limit = 10) => {
  const rep = await axiosInstance.get(`/locations/admin?page=${page}&limit=${limit}`)
  return rep.data
}

// Tạo location mới với nhiều hình ảnh
export const createLocationAPI = async (formData) => {
  const rep = await axiosInstance.post("/locations", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return rep.data
}

// Cập nhật location với khả năng thêm/sửa/xóa hình ảnh
export const updateLocationAPI = async (locationId, formData) => {
  const rep = await axiosInstance.put(`/locations/${locationId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return rep.data
}

// Xóa mềm location
export const deleteLocationAPI = async (locationId) => {
  const rep = await axiosInstance.delete(`/locations/${locationId}`)
  return rep.data
}

// Lấy chi tiết location theo ID (nếu cần)
export const getLocationByIdAPI = async (locationId) => {
  const rep = await axiosInstance.get(`/locations/${locationId}`)
  return rep.data
}

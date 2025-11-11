import { axiosInstance } from "./axiosConfig"

// 1. Lấy tất cả phòng
export const getListRoomAPI = async () => {
  const rep = await axiosInstance.get("/rooms")
  return rep.data
}

// 2. Tạo phòng mới
export const createRoomAPI = async (roomData) => {
  const rep = await axiosInstance.post("/rooms", roomData)
  return rep.data
}

// 3. Lấy chi tiết phòng theo ID
export const getRoomByIdAPI = async (roomId) => {
  const rep = await axiosInstance.get(`/rooms/${roomId}`)
  return rep.data
}

// 4. Cập nhật thông tin phòng
export const updateRoomAPI = async (roomId, roomData) => {
  const rep = await axiosInstance.put(`/rooms/${roomId}`, roomData)
  return rep.data
}

// 5. Xóa phòng (hard delete)
export const deleteRoomAPI = async (roomId) => {
  const rep = await axiosInstance.delete(`/rooms/${roomId}`)
  return rep.data
}

// 6. Xóa mềm phòng (soft delete)
export const softDeleteRoomAPI = async (roomId) => {
  const rep = await axiosInstance.patch(`/rooms/${roomId}/soft-delete`)
  return rep.data
}

// 7. Lấy danh sách phòng theo location ID
export const getRoomsByLocationIdAPI = async (locationId) => {
  const rep = await axiosInstance.get(`/rooms/location/${locationId}`)
  return rep.data
}

// 8. Lấy danh sách phòng kèm buổi học theo location ID (CHỨC NĂNG MỚI)
export const getListRoomByLocationIdAPI = async (locationId) => {
  const rep = await axiosInstance.get(`/rooms/location/${locationId}/sessions`)
  return rep.data
}

// 9. Lấy tình trạng có sẵn của phòng theo ngày
export const getRoomAvailabilityAPI = async (roomId, date) => {
  const rep = await axiosInstance.get(`/rooms/${roomId}/availability`, {
    params: { date }, // date format: YYYY-MM-DD
  })
  return rep.data
}

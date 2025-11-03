import { axiosInstance } from "./axiosConfig"

// Get all equipments
export const getListEquipmentAPI = async () => {
  const rep = await axiosInstance.get("/equipments")
  return rep.data
}

// Get equipment by ID
export const getEquipmentByIdAPI = async (id) => {
  const rep = await axiosInstance.get("/equipments/" + id)
  return rep.data
}

// Get equipments by location ID
export const getEquipmentsByLocationAPI = async (locationId) => {
  const rep = await axiosInstance.get("/equipments/location/" + locationId)
  return rep.data
}

// Get equipments by status
export const getEquipmentsByStatusAPI = async (status) => {
  const rep = await axiosInstance.get("/equipments/status/" + status)
  return rep.data
}

// Get equipments by muscle category
export const getEquipmentsByMuscleAPI = async (muscleCategory) => {
  const rep = await axiosInstance.get("/equipments/muscle/" + muscleCategory)
  return rep.data
}

// Search equipments
export const searchEquipmentsAPI = async (searchTerm) => {
  const rep = await axiosInstance.get("/equipments/search?q=" + encodeURIComponent(searchTerm))
  return rep.data
}

// Create new equipment
export const addEquipmentAPI = async (formData) => {
  const rep = await axiosInstance.post("/equipments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

// Update equipment
export const updateEquipmentAPI = async (id, formData) => {
  const rep = await axiosInstance.put("/equipments/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

// Update equipment status only
export const updateEquipmentStatusAPI = async (id, status) => {
  const rep = await axiosInstance.patch("/equipments/" + id + "/status", { status })
  return rep.data
}

// Soft delete equipment
export const softDeleteEquipmentAPI = async (id) => {
  const rep = await axiosInstance.patch("/equipments/" + id + "/soft-delete")
  return rep.data
}

// Get maintenance history
export const getMaintenanceHistoryAPI = async (id) => {
  const rep = await axiosInstance.get("/equipments/" + id + "/maintenance")
  return rep.data
}

// Add maintenance record
export const addMaintenanceRecordAPI = async (id, maintenanceData) => {
  const rep = await axiosInstance.post("/equipments/" + id + "/maintenance", maintenanceData)
  return rep.data
}

// Update maintenance record
export const updateMaintenanceRecordAPI = async (id, maintenanceIndex, maintenanceData) => {
  const rep = await axiosInstance.put("/equipments/" + id + "/maintenance/" + maintenanceIndex, maintenanceData)
  return rep.data
}

// Delete maintenance record
export const deleteMaintenanceRecordAPI = async (id, maintenanceIndex) => {
  const rep = await axiosInstance.delete("/equipments/" + id + "/maintenance/" + maintenanceIndex)
  return rep.data
}

// Check if maintenance record can be edited (created today)
export const canEditMaintenanceRecord = (maintenanceRecord) => {
  if (!maintenanceRecord.date) return false

  const recordDate = new Date(maintenanceRecord.date).toDateString()
  const today = new Date().toDateString()

  return recordDate === today
}

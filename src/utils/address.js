// Import data từ JSON files
import provinceData from "~/data/province.json"
import wardData from "~/data/ward.json"

// Utility functions for province/ward management
export const getProvinces = () => {
  return Object.values(provinceData)
    .map((province) => ({
      code: province.code,
      name: province.name,
      nameWithType: province.name_with_type,
      type: province.type,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const getWardsByProvinceCode = (provinceCode) => {
  return Object.values(wardData)
    .filter((ward) => ward.parent_code === provinceCode)
    .map((ward) => ({
      code: ward.code,
      name: ward.name,
      nameWithType: ward.name_with_type,
      type: ward.type,
      parentCode: ward.parent_code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export const getProvinceByCode = (provinceCode) => {
  return provinceData[provinceCode] || null
}

export const getWardByCode = (wardCode) => {
  return wardData[wardCode] || null
}

export const getProvinceByName = (provinceName) => {
  return (
    Object.values(provinceData).find(
      (province) => province.name === provinceName || province.name_with_type === provinceName,
    ) || null
  )
}

export const getWardByName = (wardName, provinceCode = null) => {
  const wards = Object.values(wardData)

  if (provinceCode) {
    return (
      wards.find(
        (ward) => ward.parent_code === provinceCode && (ward.name === wardName || ward.name_with_type === wardName),
      ) || null
    )
  }

  return wards.find((ward) => ward.name === wardName || ward.name_with_type === wardName) || null
}

// Format functions
export const formatAddressForDisplay = (address) => {
  if (!address) return ""
  return `${address.street}, ${address.ward}, ${address.province}`
}

export const validateVietnameseAddress = (address) => {
  if (!address || !address.street || !address.ward || !address.province) {
    return false
  }

  const province = getProvinceByName(address.province)
  if (!province) return false

  const ward = getWardByName(address.ward, province.code)
  if (!ward) return false

  return true
}

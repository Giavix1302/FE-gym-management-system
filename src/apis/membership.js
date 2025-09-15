import { axiosInstance } from "./axiosConfig"
// import { formatPhoneNumber } from "~/utils/common"

// Login (dùng axiosPublic vì chưa có token)
export const getListMembershipAPI = async () => {
  const rep = await axiosInstance.get("/memberships")
  return rep.data
}

export const addMembershipAPI = async (formData) => {
  const rep = await axiosInstance.post("/memberships", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

export const updateMembershipAPI = async (id, formData) => {
  const rep = await axiosInstance.put("/memberships/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return rep.data
}

export const deleteMembershipAPI = async (id) => {
  const rep = await axiosInstance.delete("/memberships/" + id)
  return rep.data
}

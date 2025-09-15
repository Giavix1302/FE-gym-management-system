import { toast } from "react-toastify"

export const formatCurrencyVND = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ"
}

export function formatPhoneNumber(phone) {
  if (!phone) return ""

  // Bỏ khoảng trắng, dấu gạch... chỉ lấy số
  let cleaned = phone.replace(/\D/g, "")

  // Nếu bắt đầu bằng "0" → thay bằng "+84"
  if (cleaned.startsWith("0")) {
    return "+84" + cleaned.slice(1)
  }

  // Nếu đã có "84" phía trước nhưng chưa có "+"
  if (cleaned.startsWith("84")) {
    return "+" + cleaned
  }

  // Nếu đã có dạng +84 rồi thì giữ nguyên
  if (cleaned.startsWith("+84")) {
    return cleaned
  }

  // Trường hợp khác thì trả lại nguyên bản
  return cleaned
}

export const isValidPhone = (phone) => /^0\d{9}$/.test(phone)

export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const isOver12 = (birthOfDate) => {
  if (!birthOfDate.day || !birthOfDate.month || !birthOfDate.year) return false

  const birthDate = new Date(Number(birthOfDate.year), Number(birthOfDate.month) - 1, Number(birthOfDate.day))

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()

  // Nếu chưa qua sinh nhật năm nay thì trừ thêm 1 tuổi
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }

  return age >= 12
}

export const convertToISODateTime = ({ day, month, year, hour = 0, minute = 0, second = 0 }) => {
  if (!day || !month || !year) return null

  // new Date(year, monthIndex, day, hour, minute, second)
  const date = new Date(year, month - 1, day, hour, minute, second)

  return date.toISOString() // => "2004-02-13T14:30:45.000Z"
}

// Hàm lưu dữ liệu vào localStorage
export function saveToLocalStorage(key, value) {
  try {
    // Chuyển object/array thành JSON string trước khi lưu
    const jsonData = JSON.stringify(value)
    localStorage.setItem(key, jsonData)
  } catch (error) {
    console.error("Lỗi khi lưu vào localStorage:", error)
  }
}

// Hàm lấy dữ liệu từ localStorage
export function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null // Parse JSON string về object/array
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ localStorage:", error)
    return null
  }
}

// Hàm xóa 1 key trong localStorage
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu trong localStorage:", error)
  }
}

export function calculateMonthlyPrice(months, totalPrice, discountPercent) {
  // Calculate the total after discount
  const discountedTotal = totalPrice * (1 - discountPercent / 100)

  // Calculate the average price per month
  const monthlyPrice = discountedTotal / months

  return monthlyPrice
}

export function calculateDiscountedPrice(originalPrice, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100")
  }

  const discountAmount = (originalPrice * discountPercent) / 100
  const finalPrice = originalPrice - discountAmount

  return {
    originalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
  }
}

export function formatISODateToVNDate(isoString) {
  if (!isoString) return ""

  const date = new Date(isoString)

  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0") // tháng bắt đầu từ 0
  const year = date.getUTCFullYear()

  return `${day}/${month}/${year}`
}

export function calculateProgressPercent(startDateISO, endDateISO) {
  if (startDateISO === "" || endDateISO === "") {
    return 0
  }
  const start = new Date(startDateISO)
  const end = new Date(endDateISO)
  const now = new Date()

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format")
  }

  // Nếu end <= start thì coi như tiến trình đã hoàn thành
  if (end <= start) return 100

  // Tổng thời gian (ms)
  const total = end.getTime() - start.getTime()
  // Thời gian đã trôi qua (ms)
  const elapsed = now.getTime() - start.getTime()

  // Nếu chưa bắt đầu
  if (elapsed <= 0) return 0

  // Nếu đã kết thúc
  if (elapsed >= total) return 100

  // Tính % tiến trình
  return Math.round((elapsed / total) * 100)
}

export const copyToClipboard = (text, fieldName) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(`Đã copy ${fieldName} thành công!`)
    })
    .catch(() => {
      toast.error(`Không thể copy ${fieldName}`)
    })
}

export const computeRemaining = (expireAtInput) => {
  if (!expireAtInput) return { expired: true, remainingMs: 0, remainingSeconds: 0, formatted: "00:00" }

  const expireAt = new Date(String(expireAtInput))
  if (isNaN(expireAt.getTime())) return { expired: true, remainingMs: 0, remainingSeconds: 0, formatted: "00:00" }

  const diffMs = expireAt.getTime() - Date.now()
  if (diffMs <= 0) return { expired: true, remainingMs: 0, remainingSeconds: 0, formatted: "00:00" }

  const remainingSeconds = Math.floor(diffMs / 1000)
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, "0")
  const ss = String(remainingSeconds % 60).padStart(2, "0")

  return {
    expired: false,
    remainingMs: diffMs,
    remainingSeconds,
    formatted: `${mm}:${ss}`,
  }
}

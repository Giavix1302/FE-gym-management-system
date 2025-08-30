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

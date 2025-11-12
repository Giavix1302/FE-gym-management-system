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

export function formatToLeadingZero(input) {
  if (input == null) return null
  // chuyển thành chuỗi, loại bỏ khoảng trắng 2 đầu
  let s = String(input).trim()

  // loại bỏ mọi ký tự không phải số (như +, -, spaces, parens, ...)
  s = s.replace(/\D/g, "")

  if (!s) return null

  // trường hợp bắt đầu bằng 0084 (thường thấy khi có tiền tố 00)
  if (s.startsWith("0084")) {
    return "0" + s.slice(4)
  }

  // trường hợp bắt đầu bằng 84 (ví dụ 84987654321 hoặc +84987654321 sau khi remove non-digits)
  if (s.startsWith("84") && s.length > 2) {
    return "0" + s.slice(2)
  }

  // nếu đã bắt đầu bằng 0 thì giữ nguyên
  if (s.startsWith("0")) {
    return s
  }

  // fallback: nếu là chuỗi số khác (ví dụ thiếu mã) — trả về nguyên vẹn (hoặc null tuỳ ý)
  return s
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

// "2004-02-13T00:00:00.000Z" -> 13/02/2004
export function convertISOToVNTime(isoString, withTime = false) {
  if (!isoString) return ""

  const date = new Date(isoString)

  const options = {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  if (withTime) {
    options.hour = "2-digit"
    options.minute = "2-digit"
    options.second = "2-digit"
    options.hour12 = false
  }

  return new Intl.DateTimeFormat("en-GB", options).format(date)
}

// 13/02/2004 -> "2004-02-13T00:00:00.000Z"
export const toISODate = (dateStr) => {
  if (!dateStr) return null

  // Tách ngày/tháng/năm
  const [day, month, year] = dateStr.split("/")

  // Tạo đối tượng Date (JS month bắt đầu từ 0)
  const date = new Date(Date.UTC(year, month - 1, day))

  // Trả về định dạng ISO 8601
  return date.toISOString()
}

// --- Ví dụ sử dụng ---
//   const result = convertToISODateRange(
//     { day: 24, month: 9, year: 2025 },
//     { hour: 9, minute: 0 },
//     { hour: 11, minute: 0 }
//   )
//console.log(result) { startISO: "2025-09-24T02:00:00.000Z", endISO: "2025-09-24T04:00:00.000Z" }
export function convertToISODateRange(dateObj, startTime, endTime) {
  const { day, month, year } = dateObj

  const startDate = new Date(year, month - 1, day, startTime.hour, startTime.minute)
  const endDate = new Date(year, month - 1, day, endTime.hour, endTime.minute)

  // Validation
  if (startDate >= endDate) {
    toast.error("Giờ bắt đầu phải trước giờ kết thúc")
  }

  const diffMs = endDate - startDate
  const diffHours = diffMs / (1000 * 60 * 60)

  if (diffHours < 1) {
    toast.error("Khoảng cách tối thiểu phải 1 giờ")
  }

  if (diffHours > 4) {
    toast.error("Khoảng cách không được vượt quá 4 giờ")
  }

  // Luôn trả về ISO UTC string để gửi backend
  return {
    startISO: startDate.toISOString(),
    endISO: endDate.toISOString(),
  }
}

export const convertEvents = (events) => {
  return events.map((event) => {
    const parseISO = (iso) => {
      if (!iso) return null
      const isoString = typeof iso === "string" ? iso : iso.toISOString()

      const [datePart, timePartWithMs] = isoString.split("T")
      const [year, month, day] = datePart.split("-").map(Number)
      const [hour, minute] = timePartWithMs.split(":").map(Number)

      return new Date(year, month - 1, day, hour, minute)
    }

    return {
      ...event,
      startTime: parseISO(event.startTime),
      endTime: parseISO(event.endTime),
    }
  })
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

const userKeys = ["email", "gender", "dateOfBirth", "address", "age", "phone", "avatar", "fullName"]
const trainerKeys = ["bio", "education", "experience", "specialization", "isApproved", "pricePerHour"]

export function splitUserTrainerData(data) {
  const userData = {}
  const trainerData = {}

  for (const key in data) {
    if (userKeys.includes(key)) {
      userData[key] = data[key]
    }
    if (trainerKeys.includes(key)) {
      trainerData[key] = data[key]
    }
  }

  return { userData, trainerData }
}

export function buildFormData(data) {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value == null || value === "") return // bỏ qua field null/empty

    // Nếu là array file (ví dụ images)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item)
      })
    } else {
      formData.append(key, value)
    }
  })

  return formData
}

export function isValidTimeRange(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)

  // Nếu 1 trong 2 không phải thời gian hợp lệ
  if (isNaN(start) || isNaN(end)) return false

  // Chỉ hợp lệ nếu start < end (loại cả trường hợp trùng)
  return start.getTime() < end.getTime()
}

export function getHoursBetween(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)

  // Tính khoảng cách mili-giây giữa 2 thời điểm
  const diffMs = end - start

  // Chuyển mili-giây → giờ
  const diffHours = diffMs / (1000 * 60 * 60)

  return diffHours
}

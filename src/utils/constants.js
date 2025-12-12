export const navItemsUnsigned = [
  {
    title: "Về THE GYM",
    link: "/about",
  },
  {
    title: "Hệ thống phòng tập",
    link: "/gym-system",
  },
  {
    title: "Gói thuê PT",
    link: "/pt-package",
  },
  {
    title: "Lớp tập nhóm",
    link: "/fitness-class",
  },
  {
    title: "Liên hệ",
    link: "/contact",
  },
]

export const navItemUserSigned = [
  {
    title: "Trang chủ",
    link: "user/home",
  },
  {
    title: "Các gói tập",
    link: "user/membership",
  },
  {
    title: "Đặt PT",
    link: "user/booking",
  },
  {
    title: "Lớp học",
    link: "user/class",
  },
]

export const navItemPTSigned = [
  { title: "Trang chủ", link: "pt/home" },
  { title: "Lịch dạy PT", link: "pt/booking" },
  { title: "Lớp học", link: "pt/class" },
  {
    title: "Các gói tập",
    link: "pt/membership",
  },
]

export const EQUIPMENT_MUSCLE_CATEGORIES = {
  // Nhóm cơ trên cơ thể
  CHEST: "chest", // Ngực
  SHOULDERS: "shoulders", // Vai
  ARMS: "arms", // Cánh tay (tay trước, tay sau)
  BICEPS: "biceps", // Tay trước
  TRICEPS: "triceps", // Tay sau
  BACK: "back", // Lưng
  LATS: "lats", // Cánh tay rộng

  // Nhóm cơ core
  ABS: "abs", // Bụng
  CORE: "core", // Cơ core tổng thể
  OBLIQUES: "obliques", // Cơ bụng chéo

  // Nhóm cơ dưới cơ thể
  LEGS: "legs", // Chân tổng thể
  QUADRICEPS: "quadriceps", // Đùi trước
  HAMSTRINGS: "hamstrings", // Đùi sau
  GLUTES: "glutes", // Mông
  CALVES: "calves", // Bắp chân

  // Toàn thân
  FULL_BODY: "full_body", // Toàn thân
  CARDIO: "cardio", // Tim mạch

  // Nhóm cơ khác
  FOREARMS: "forearms", // Cẳng tay
  NECK: "neck", // Cổ
  FLEXIBILITY: "flexibility", // Độ dẻo dai
}

export const MUSCLE_CATEGORY_LABELS = {
  [EQUIPMENT_MUSCLE_CATEGORIES.CHEST]: "Ngực",
  [EQUIPMENT_MUSCLE_CATEGORIES.SHOULDERS]: "Vai",
  [EQUIPMENT_MUSCLE_CATEGORIES.ARMS]: "Cánh tay",
  [EQUIPMENT_MUSCLE_CATEGORIES.BICEPS]: "Tay trước (Biceps)",
  [EQUIPMENT_MUSCLE_CATEGORIES.TRICEPS]: "Tay sau (Triceps)",
  [EQUIPMENT_MUSCLE_CATEGORIES.BACK]: "Lưng",
  [EQUIPMENT_MUSCLE_CATEGORIES.LATS]: "Cánh tay rộng (Lats)",
  [EQUIPMENT_MUSCLE_CATEGORIES.ABS]: "Bụng",
  [EQUIPMENT_MUSCLE_CATEGORIES.CORE]: "Cơ core",
  [EQUIPMENT_MUSCLE_CATEGORIES.OBLIQUES]: "Cơ bụng chéo",
  [EQUIPMENT_MUSCLE_CATEGORIES.LEGS]: "Chân",
  [EQUIPMENT_MUSCLE_CATEGORIES.QUADRICEPS]: "Đùi trước",
  [EQUIPMENT_MUSCLE_CATEGORIES.HAMSTRINGS]: "Đùi sau",
  [EQUIPMENT_MUSCLE_CATEGORIES.GLUTES]: "Mông",
  [EQUIPMENT_MUSCLE_CATEGORIES.CALVES]: "Bắp chân",
  [EQUIPMENT_MUSCLE_CATEGORIES.FULL_BODY]: "Toàn thân",
  [EQUIPMENT_MUSCLE_CATEGORIES.CARDIO]: "Tim mạch",
  [EQUIPMENT_MUSCLE_CATEGORIES.FOREARMS]: "Cẳng tay",
  [EQUIPMENT_MUSCLE_CATEGORIES.NECK]: "Cổ",
  [EQUIPMENT_MUSCLE_CATEGORIES.FLEXIBILITY]: "Độ dẻo dai",
}

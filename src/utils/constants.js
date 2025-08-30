/* eslint-disable no-undef */
let apiRoot = ""
if (process.env.BUILD_MODE === "development") {
  apiRoot = "http://localhost:3000/v1"
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = ""
}
// export const API_ROOT = 'http://localhost:1302'
export const API_ROOT = apiRoot

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
  {
    title: "Tin tức",
    link: "user/news",
  },
  {
    title: "Trợ lí AI",
    link: "/chat-bot",
  },
]

export const navItemPTSigned = [
  {
    title: "Trang chủ",
    link: "pt/home",
  },
  {
    title: "Lịch dạy PT",
    link: "pt/booking",
  },
  {
    title: "Lớp học",
    link: "pt/class",
  },
  {
    title: "Tin tức",
    link: "pt/news",
  },
  {
    title: "Trợ lí AI",
    link: "pt/chat-bot",
  },
]

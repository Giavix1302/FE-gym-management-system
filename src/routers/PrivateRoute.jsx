// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { getFromLocalStorage, removeFromLocalStorage } from "~/utils/common"

export default function PrivateRoute({ roles }) {
  const token = getFromLocalStorage("accessToken")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  try {
    const decoded = jwtDecode(token)

    // ✅ Kiểm tra token hết hạn
    const now = Date.now() / 1000
    if (decoded.exp && decoded.exp < now) {
      removeFromLocalStorage("accessToken")
      return <Navigate to="/login" replace />
    }

    // ✅ Kiểm tra quyền truy cập
    if (roles && !roles.includes(decoded.role)) {
      // ✅ Điều hướng về trang phù hợp với role thay vì về "/"
      const roleHomePaths = {
        admin: "/admin/dashboard",
        staff: "/staff/dashboard",
        user: "/user/home",
        pt: "/pt/home",
      }

      const redirectPath = roleHomePaths[decoded.role] || "/"
      return <Navigate to={redirectPath} replace />
    }

    return <Outlet />
  } catch (err) {
    // Token lỗi (ví dụ bị sửa)
    removeFromLocalStorage("accessToken")
    return <Navigate to="/login" replace />
  }
}

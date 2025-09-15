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

    if (roles && !roles.includes(decoded.role)) {
      return <Navigate to="/" replace />
    }

    return <Outlet />
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    // Token lỗi (ví dụ bị sửa)
    removeFromLocalStorage("accessToken")
    return <Navigate to="/login" replace />
  }
}

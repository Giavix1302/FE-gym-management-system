// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom"
import jwtDecode from "jwt-decode"

export default function PrivateRoute({ roles }) {
  const token = localStorage.getItem("token")

  if (!token) return <Navigate to="/login" replace />

  try {
    const decoded = jwtDecode(token)

    // Kiểm tra role có nằm trong roles được phép không
    if (roles && !roles.includes(decoded.role)) {
      return <Navigate to="/" replace />
    }

    return <Outlet /> // Nếu hợp lệ thì render children
  } catch (err) {
    return <Navigate to="/login" replace />
  }
}

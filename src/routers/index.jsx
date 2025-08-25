import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DefaultLayout from "~/layouts/defaultLayout"
import Home from "~/pages/homeUnsigned/Home"

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        {/* <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route> */}

        {/* User Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/equipments" element={<EquipmentListPage />} />
        </Route> */}
      </Routes>
    </Router>
  )
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Layouts
import UserLayout from '../layouts/UserLayout'
import AuthLayout from '../layouts/AuthLayout'
// pages

import Home from '../modules/home/pages/Home'
import DangNhap from '../modules/auth/DangNhap'
import DangKy from '../modules/auth/DangKy'
import QuenMk from '../modules/auth/QuenMk'

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dangnhap" element={<DangNhap />} />
          <Route path="/dangky" element={<DangKy />} />
          <Route path="/quenmk" element={<QuenMk />} />
        </Route>

        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/equipments" element={<EquipmentListPage />} />
        </Route> */}
      </Routes>
    </Router>
  );
}
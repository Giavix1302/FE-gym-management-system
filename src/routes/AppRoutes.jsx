import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from '../layouts/UserLayout'

// pages
import Home from '../modules/home/pages/Home'


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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import DefaultLayout from "~/layouts/defaultLayout"
import AuthLayout from "~/layouts/AuthLayout"

import Home from "~/pages/homeUnsigned/Home"
import NotFoundPage from "~/pages/NotFoundPage"
import Login from "~/pages/auth/Login"
import Signup from "~/pages/auth/Signup"

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* User Routes */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/equipments" element={<EquipmentListPage />} />
        </Route> */}

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

// src/layouts/UserLayout.jsx
import { Outlet, Link } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function UserLayout() {
  return (
    <div>
      <Header />

      <main>
        <Outlet /> {/* Nơi render các page con */}
      </main>

      <Footer />
    </div>
  );
}
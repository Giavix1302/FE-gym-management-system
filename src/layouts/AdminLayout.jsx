import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Gói tập</Link> |{" "}
          <Link to="/booking">Đặt lịch PT</Link>
        </nav>
      </header>

      <main>
        <Outlet /> {/* Nơi render các page con */}
      </main>

      <footer>
        <h1>footer</h1>
      </footer>
    </div>
  );
}
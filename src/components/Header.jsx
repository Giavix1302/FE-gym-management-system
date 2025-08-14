
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import logo from "../assets/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/dangnhap");
  };
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 40px",
      background: "#fff",
      borderBottom: "2px solid #e6e6e6",
      minHeight: 70,
      position: "relative"
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 48, marginRight: 10 }} />
      </div>
      {/* Navigation */}
      <nav style={{ flex: 1, marginLeft: 40 }}>
        <ul style={{
          display: "flex",
          alignItems: "center",
          gap: 40,
          listStyle: "none",
          margin: 0,
          padding: 0
        }}>
          <li style={{ fontWeight: 700, cursor: "pointer", position: "relative" }}>
            Về The New Gym <span style={{ fontSize: 12 }}>▼</span>
          </li>
          <li style={{ fontWeight: 700, cursor: "pointer" }}>
            Hệ Thống Phòng Tập
          </li>
          <li style={{ fontWeight: 700, cursor: "pointer" }}>
            Gói Thuê PT
          </li>
          <li style={{ fontWeight: 700, cursor: "pointer", position: "relative" }}>
            Các Bài Tập <span style={{ fontSize: 12 }}>▼</span>
          </li>
          <li style={{ fontWeight: 700, cursor: "pointer", position: "relative" }}>
            Tin Tức <span style={{ fontSize: 12 }}>▼</span>
          </li>
          <li style={{ fontWeight: 700, cursor: "pointer" }}>
            Liên Hệ
          </li>
        </ul>
      </nav>
      {/* Language & Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            width: 24,
            height: 16,
            background: "#ff4b55",
            borderRadius: 2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#fff",
            fontWeight: 700,
            padding: "0 4px"
          }}>★</span>
          <span style={{ fontWeight: 700 }}>VN</span>
          <span style={{ fontSize: 12, marginLeft: 2 }}>▼</span>
        </div>
        <button
          style={{
            background: "#00cfff",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 24,
            padding: "10px 32px",
            fontSize: 20,
            cursor: "pointer"
          }}
          onClick={handleLoginClick}
        >
          Đăng Nhập
        </button>
      </div>
    </header>
  );
};

export default Header;

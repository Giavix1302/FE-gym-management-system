import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuenMk = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi email thành công
    setSent(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0077B6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 400, maxWidth: '98vw', background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '48px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 0, color: '#222' }}>Quên mật khẩu</h2>
        <div style={{ color: '#6c757d', fontSize: 18, marginBottom: 32, marginTop: 4 }}>Nhập email để lấy lại mật khẩu</div>
        {sent ? (
          <div style={{ color: '#0077B6', fontSize: 18, textAlign: 'center', margin: '32px 0' }}>
            Đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn!<br/>
            Vui lòng kiểm tra hộp thư.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input
              type="email"
              placeholder="Email đăng ký"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                padding: '13px 18px',
                fontSize: 17,
                border: '1.5px solid #e0e0e0',
                borderRadius: 24,
                outline: 'none',
                width: '100%',
                marginBottom: 0,
                background: '#fafbfc',
                transition: 'border 0.2s'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '13px',
                fontSize: 18,
                background: '#0077B6',
                color: '#fff',
                border: 'none',
                borderRadius: 24,
                fontWeight: 700,
                marginTop: 8,
                letterSpacing: 1,
                boxShadow: '0 2px 8px rgba(55,125,138,0.08)'
              }}
            >
              Gửi yêu cầu
            </button>
          </form>
        )}
        <div style={{ width: '100%', maxWidth: 320, textAlign: 'right', marginTop: 18 }}>
          <span
            style={{ color: '#b0b8be', textDecoration: 'none', fontSize: 14, cursor: 'pointer' }}
            onClick={() => navigate('/dangnhap')}
          >
            Quay lại đăng nhập
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuenMk;
